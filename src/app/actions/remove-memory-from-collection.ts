"use server";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function removeMemoryFromCollection(
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

      // If memoryId is in the collection's memories array, remove it
      if (collection && collection.memories.includes(memoryId)) {
        await db.collection.update({
          where: { id: collectionId },
          data: {
            memories: {
              set: collection.memories.filter((memory) => memory !== memoryId),
            },
          },
        });
      }

        // Fetch the current state of the collections array
        const memory = await db.memory.findUnique({
          where: { id: memoryId },
          select: { collections: true },
        });

        // If collectionId is in the memory's collections array, remove it
        if (memory && memory.collections.includes(collectionId)) {
          await db.memory.update({
            where: { id: memoryId },
            data: {
              collections: {
                set: memory.collections.filter((collection: string) => collection !== collectionId),
              },
            },
          });
        }

    });

    revalidatePath(`/collection/${collectionId}`);
    return { success: "Memory removed from collection successfully" };
  } catch (error) {
    console.error("Error removing memory from collection:", error);
    return {
      error: `Failed to remove memory from collection: ${
        (error as Error).message
      }`,
    };
  }
}
