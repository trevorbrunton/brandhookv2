import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // or wherever your prisma client is imported

export async function POST(req: NextRequest) {
  try {
    const { projectId, jobId } = await req.json();
    // Fetch all COMPLETED "CREATE_USER" jobs
await db.jobQueue.create({
      data: {
        projectId: projectId,
        jobId: jobId,
        jobType: "TRANSCRIBE",
        jobStatus: "PENDING",
        completionPayload: "",
        createDate: new Date().toLocaleString("en-AU"),
        updateDate: new Date().toLocaleString("en-AU"),
        
      },
    });
    return new NextResponse(JSON.stringify({ jobId }), { status: 200 });
  } catch (error) {
    console.error("Error processing audio file:", error);
    return new NextResponse(
      JSON.stringify({
        error: "An error occurred while creating the job record.",
      }),
      {
        status: 500,
      }
    );
  }
}