import { Client } from "@gradio/client";
import fs from "fs";
import path from "path";

const SPACE_URL = "THUDM/CogVideoX-5B-Space";

async function generateVideo(options = {}) {
  const {
    prompt = "A beautiful sunset over the ocean",
    seed = -1,
    superResolution = false,
    frameInterpolation = true,
    outputPath = `output-${Date.now()}.mp4`,
  } = options;

  console.log(`Connecting to HuggingFace Space: ${SPACE_URL}...`);
  const client = await Client.connect(SPACE_URL);

  console.log(`Generating video for prompt: "${prompt}"`);
  console.log(
    `Settings: seed: ${seed === -1 ? "random" : seed}, superRes: ${superResolution}, interpolation: ${frameInterpolation}`,
  );

  const job = client.submit("/generate", [
    prompt, // Prompt
    null, // Input Image (optional)
    null, // Input Video (optional)
    0.8, // Strength
    seed, // Seed (-1 for random)
    superResolution, // Super-Resolution (720x480 -> 2880x1920)
    frameInterpolation, // Frame Interpolation (8fps -> 16fps)
  ]);

  let result;
  for await (const event of job) {
    if (event.type === "status") {
      if (event.stage === "pending") {
        const pos = event.queue_position;
        if (pos !== undefined && pos !== null) {
          console.log(`Queue position: ${pos}`);
        }
      } else if (event.stage === "generating") {
        console.log("Generating...");
      }
    } else if (event.type === "progress" && event.progress_data?.length) {
      for (const p of event.progress_data) {
        const pct =
          p.index !== undefined && p.length
            ? Math.round((p.index / p.length) * 100)
            : null;
        const desc = p.desc || "Processing";
        console.log(pct !== null ? `${desc}: ${pct}%` : desc);
      }
    } else if (event.type === "data") {
      result = event;
    }
  }

  if (!result) {
    console.error("No result received from the Space.");
    return;
  }

  // result.data: [video, downloadVideo, downloadGif, seedUsed]
  const videoData = result.data[0];
  const seedUsed = result.data[3];
  console.log(`Video generated! Seed used: ${seedUsed}`);

  const videoUrl = videoData?.url || videoData?.path;
  if (!videoUrl) {
    console.error("Unexpected response format:", videoData);
    return;
  }

  const url = videoData.url;
  console.log("Downloading video...");
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  const outputFile = path.resolve(outputPath);
  fs.writeFileSync(outputFile, buffer);
  console.log(`Video saved to: ${outputFile}`);
}

const args = process.argv.slice(2);
const prompt =
  args.join(" ") || "A futuristic cityscape at night with neon lights";

generateVideo({ prompt }).catch(console.error);
