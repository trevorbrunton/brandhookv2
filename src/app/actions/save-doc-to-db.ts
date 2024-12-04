"use server";
import { db } from "@/db";
import { Memory } from "@/lib/collection-types";


export async function saveDocToDb(doc: Memory, projectId: string) {
  console.log("Saving doc to db", doc, projectId);
  try {
    if (!db) {
      throw new Error("Database not available");
    } else {
      await db.memory.upsert({
        where: { documentId: doc.documentId },
        update: {
          ...doc,
        },
        create: { ...doc },
      });
      return { success: "Document Saved" };
    }
  } catch (e) {
    console.error(e);
    return { error: "Database fetch failed" };
  }
}
