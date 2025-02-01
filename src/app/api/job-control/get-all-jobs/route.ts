import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // or wherever your prisma client is imported

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json();
    // Fetch all COMPLETED "CREATE_USER" jobs
    const completedJobs = await db.jobQueue.findMany({
      where: {
        projectId: projectId,
        jobType: "TRANSCRIBE",
      },
    });
    return new NextResponse(JSON.stringify({ completedJobs }), { status: 200 });
  } catch (error) {
    console.error("Error processing audio file:", error);
    return new NextResponse(
      JSON.stringify({
        error: "An error occurred while processing the audio file.",
      }),
      {
        status: 500,
      }
    );
  }
}
