"use server";

import { db } from "@/db";


export async function createJob(projectId: string, jobId: string) {
  try {
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
    return {
      jobId,
    };
  } catch (error) {
    console.error("Error creating job:", error);
    throw new Error(`error creating job: ${(error as Error).message}`);
  }
}
