"use server";
import { db } from "@/db";
import { revalidatePath } from "next/cache";


export async function addMemoryToCollection(
  memoryId: string,
  collectionId: string
) {
  console.log("memoryId", memoryId);
  console.log("collectionId", collectionId);
  try {
    await db.$transaction(async (db) => {
      // Fetch the current state of the memories array
      const collection = await db.collection.findUnique({
        where: { id: collectionId },
        select: { memories: true },
      });

      // If memoryId is not in the collection's memories array, add it
      if (collection && !collection.memories.includes(memoryId)) {
        await db.collection.update({
          where: { id: collectionId },
          data: {
            memories: {
              set: [...collection.memories, memoryId],
            },
          },
        });
      }
      const memory = await db.memory.findUnique({
        where: { id: memoryId },
        select: { collections: true },
      });
      // If collectionId is not in the memory's collection array, add it
      if (memory && !memory.collections.includes(collectionId)) {
        await db.memory.update({
          where: { id: memoryId },
          data: {
            collections: {
              set: [...memory.collections, collectionId],
            },
          },
        });
      }
    });

    revalidatePath(`/collection/${collectionId}`);
    return { success: "Memory added to collection successfully" };
  } catch (error) {
    console.error("Error adding memory to collection:", error);
    return {
      error: `Failed to add memory to collection: ${(error as Error).message}`,
    };
  }
}
