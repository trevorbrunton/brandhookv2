"use server";
import { db } from "@/db";

export async function fetchMemory(collectionId: string, docType: string) {
  try {
    if (!db) {
      throw new Error("Database not available");
    }

    const document = await db.memory.findFirst({
      where: {
        collectionId: collectionId,
        docType: docType,
      },
    });
    
    // Return null if no document is found 
    return document ? { success: document } : null;
  } catch (e) {
    console.error(e);
    return { error: "Database fetch failed" };
  }
}
