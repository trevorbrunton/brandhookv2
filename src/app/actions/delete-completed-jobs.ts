"use server";

import { db } from "@/db";

export async function deleteCompletedJobs(jobIds: string[]) {
  try {
    await db.jobQueue.deleteMany({
      where: { id: { in: jobIds }, jobStatus: "COMPLETE" },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting completed jobs:", error);
    return { success: false, error };
  }
}
