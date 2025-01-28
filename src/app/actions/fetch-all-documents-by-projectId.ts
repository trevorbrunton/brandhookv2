"use server";
import { db } from "@/db";
import { ProjectDocument } from "@prisma/client";

export async function fetchAllDocumentsByProjectId(documentId: string) {
  try {
    if (!db) {
      throw new Error("Database not available");
    }
    const documents: ProjectDocument[] = await db.projectDocument.findMany(
      {where: {id: documentId}}
    );
    console.log("documents", documents);

    return { documents };
  } catch (e) {
    console.error(e);
    return { error: "Database fetch failed" };
  }
}
