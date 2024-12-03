"use server";
import { db } from "@/db";
import { ProjectDocument } from "@/lib/project-types";
import { revalidatePath } from "next/cache";

export async function saveDocToDb(doc: ProjectDocument, projectId: string) {
  try {
    if (!db) {
      throw new Error("Database not available");
    } else {
      await db.projectDocument.upsert({
        where: { documentId: doc.documentId },
        update: {
          ...doc,
        },
        create: { ...doc },
      });
      revalidatePath(`/project-view/${projectId}`);
      return { success: "Document Saved" };
    }
  } catch (e) {
    console.error(e);
    return { error: "Database fetch failed" };
  }
}
