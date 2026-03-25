import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db, imageJobs, imageJobItems } from "@/db";
import { eq, and } from "drizzle-orm";

// GET /api/playground/images/[id] - Get job status with items
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const job = await db.query.imageJobs.findFirst({
      where: and(eq(imageJobs.id, id), eq(imageJobs.userId, user.id)),
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const items = await db.query.imageJobItems.findMany({
      where: eq(imageJobItems.jobId, id),
    });

    return NextResponse.json({ job, items });
  } catch (error) {
    console.error("[API /api/playground/images/[id] GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}
