"use server";
import { db } from "@/db";
import { ProjectDocument } from "@prisma/client";

export async function fetchAllDocumentsByProjectId(projectId: string) {

  console.log("called fetchAllDocumentsByProjectId", projectId);

  try {
    if (!db) {
      throw new Error("Database not available");
    }
    const documents: ProjectDocument[] = await db.projectDocument.findMany(
      {where: {projectId: projectId}}
    );

    return { documents };
  } catch (e) {
    console.error(e);
    return { error: "Database fetch failed" };
  }
}
