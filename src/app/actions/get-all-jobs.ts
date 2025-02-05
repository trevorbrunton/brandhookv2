"use server";
import { db } from "@/db";

export async function getAllJobs(projectId: string) {
  try {
    if (!db) {
      throw new Error("Database not available");
    }
    const completedJobs = await db.jobQueue.findMany({
      where: {
        projectId: projectId,
        jobType: "TRANSCRIBE",
      },
    });

    return completedJobs;
  } catch (e) {
    console.error(e);
    throw new Error("Database fetch failed");
  }
}
