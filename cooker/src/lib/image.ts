import { Client } from "@gradio/client";
import { uploadToR2 } from "@/lib/r2";
import { db, imageJobs, imageJobItems } from "@/db";
import { eq, sql } from "drizzle-orm";

const SPACE_URL = "mrfakename/Z-Image-Turbo";

interface GenerateImageOptions {
  prompt: string;
  height?: number;
  width?: number;
  numInferenceSteps?: number;
  seed?: number;
  randomizeSeed?: boolean;
}

export async function generateImage(
  options: GenerateImageOptions
): Promise<Buffer> {
  const {
    prompt,
    height = 1024,
    width = 1024,
    numInferenceSteps = 9,
    seed = 0,
    randomizeSeed = true,
  } = options;

  const client = await Client.connect(SPACE_URL);

  const result = await client.predict("/generate_image", {
    prompt,
    height,
    width,
    num_inference_steps: numInferenceSteps,
    seed,
    randomize_seed: randomizeSeed,
  });

  const [imageData] = result.data as [{ url?: string }, number];

  if (!imageData?.url) {
    throw new Error("Unexpected response format from image generation");
  }

  const response = await fetch(imageData.url);
  return Buffer.from(await response.arrayBuffer());
}

export async function processImageJob(jobId: string): Promise<void> {
  console.log(`[ImageService] Processing job ${jobId}`);

  await db
    .update(imageJobs)
    .set({ status: "processing" })
    .where(eq(imageJobs.id, jobId));

  const items = await db.query.imageJobItems.findMany({
    where: eq(imageJobItems.jobId, jobId),
  });

  for (const item of items) {
    try {
      await db
        .update(imageJobItems)
        .set({ status: "processing" })
        .where(eq(imageJobItems.id, item.id));

      const buffer = await generateImage({ prompt: item.prompt });

      const key = `images/${jobId}/${item.id}.png`;
      const imageUrl = await uploadToR2(key, buffer);

      await db
        .update(imageJobItems)
        .set({ status: "completed", imageUrl })
        .where(eq(imageJobItems.id, item.id));

      await db
        .update(imageJobs)
        .set({ completedImages: sql`${imageJobs.completedImages} + 1` })
        .where(eq(imageJobs.id, jobId));

      console.log(`[ImageService] Item ${item.id} completed`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[ImageService] Item ${item.id} failed:`, errorMessage);

      await db
        .update(imageJobItems)
        .set({ status: "failed", error: errorMessage })
        .where(eq(imageJobItems.id, item.id));

      await db
        .update(imageJobs)
        .set({ failedImages: sql`${imageJobs.failedImages} + 1` })
        .where(eq(imageJobs.id, jobId));
    }
  }

  const updatedJob = await db.query.imageJobs.findFirst({
    where: eq(imageJobs.id, jobId),
  });

  if (updatedJob) {
    const finalStatus =
      updatedJob.failedImages === updatedJob.totalImages
        ? "failed"
        : "completed";
    await db
      .update(imageJobs)
      .set({ status: finalStatus })
      .where(eq(imageJobs.id, jobId));
  }

  console.log(`[ImageService] Job ${jobId} finished`);
}
