"use server";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";


export async function fetchAllInterviewSummariesByProjectId(projectId: string) {
  try {
    const auth = await currentUser();

    if (!auth) {
      throw new Error("Unauthorized");
    }

    const documents = await db.projectDocument.findMany({
      where: { projectId: projectId, docType: "interview-summary" },
      select: {
        id: true,
        content: true,
      },
    });

    return documents;
  } catch (error) {
    console.error("Error fetching documents by projectId:", error);
    return {
      error: `Failed to fetch documents by projectId: ${(error as Error).message}`,
    };
  }
}
