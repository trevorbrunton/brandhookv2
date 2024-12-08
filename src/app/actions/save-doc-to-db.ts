// Called by upload-file-format.tsx
"use server";
import { db } from "@/db";
import { Memory } from "@/lib/collection-types";
import { revalidatePath } from "next/cache";

export async function saveDocToDb(doc: Memory, collectionId: string) {
  try {
    if (!db) {
      throw new Error("Database connection not available");
    }
    await db.memory.upsert({
      where: { documentId: doc.documentId },
      update: { ...doc },
      create: { ...doc },
    });
    revalidatePath(`/collection/${collectionId}`);
    return { success: "Document saved successfully" };
  } catch (error) {
    console.error("Database operation failed:", error);
    return { error: `Failed to save document: ${(error as Error).message}` };
  }
}
