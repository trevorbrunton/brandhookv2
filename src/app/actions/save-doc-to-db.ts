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
    const memory = await db.memory.create({
      data: { ...doc },
    });
    const collection = await db.collection.findUnique({
      where: { id: collectionId },
    });
    if (collection && !collection.memories.includes(memory.id)) {
      await db.collection.update({
        where: { id: collectionId },
        data: {
          memories: {
            set: [...collection.memories, memory.id],
          },
          updateDate: new Date().toISOString(),
        },
      });
    }
    revalidatePath(`/collection/${collectionId}`);
    return { success: "Document saved successfully" };
  } catch (error) {
    console.error("Database operation failed:", error);
    return { error: `Failed to save document: ${(error as Error).message}` };
  }
}
