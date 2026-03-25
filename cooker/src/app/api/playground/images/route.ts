import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { config } from "@/lib/config";
import { db, users, creditTransactions, imageJobs, imageJobItems } from "@/db";
import { eq, sql, desc } from "drizzle-orm";
import { processImageJob } from "@/lib/image";

// POST /api/playground/images - Create bulk image generation job
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { prompts } = body;

    if (!Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json(
        { error: "prompts must be a non-empty array of strings" },
        { status: 400 }
      );
    }

    if (prompts.length > config.image.maxBulkImages) {
      return NextResponse.json(
        { error: `Maximum ${config.image.maxBulkImages} images per request` },
        { status: 400 }
      );
    }

    const validPrompts = prompts.filter(
      (p: unknown) => typeof p === "string" && p.trim().length > 0
    );
    if (validPrompts.length === 0) {
      return NextResponse.json(
        { error: "At least one valid prompt is required" },
        { status: 400 }
      );
    }

    const creditsRequired = validPrompts.length * config.image.creditsPerImage;

    // Check credits
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: { credits: true },
    });

    if (!currentUser || currentUser.credits < creditsRequired) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          required: creditsRequired,
          available: currentUser?.credits ?? 0,
        },
        { status: 402 }
      );
    }

    // Deduct credits
    await db
      .update(users)
      .set({ credits: sql`${users.credits} - ${creditsRequired}` })
      .where(eq(users.id, user.id));

    // Record transaction
    await db.insert(creditTransactions).values({
      userId: user.id,
      amount: -creditsRequired,
      type: "usage",
      description: `Bulk image generation: ${validPrompts.length} images`,
    });

    // Create job
    const [job] = await db
      .insert(imageJobs)
      .values({
        userId: user.id,
        totalImages: validPrompts.length,
        status: "pending",
      })
      .returning();

    // Create job items
    await db.insert(imageJobItems).values(
      validPrompts.map((prompt: string) => ({
        jobId: job.id,
        prompt: prompt.trim(),
        status: "pending" as const,
      }))
    );

    // Start background processing (fire and forget)
    processImageJob(job.id).catch((err) =>
      console.error(`[API /api/playground/images] Job ${job.id} error:`, err)
    );

    // Get updated credits
    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: { credits: true },
    });

    return NextResponse.json({
      jobId: job.id,
      totalImages: validPrompts.length,
      creditsUsed: creditsRequired,
      credits: updatedUser?.credits ?? 0,
    });
  } catch (error) {
    console.error("[API /api/playground/images POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to create image job" },
      { status: 500 }
    );
  }
}

// GET /api/playground/images - List user's image jobs
export async function GET() {
  try {
    const user = await requireUser();

    const jobs = await db.query.imageJobs.findMany({
      where: eq(imageJobs.userId, user.id),
      orderBy: [desc(imageJobs.createdAt)],
      limit: 20,
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("[API /api/playground/images GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
