"use server";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function removeThingFromMemory(
  memoryId: string,
  thingId: string
) {
  console.log("memoryId", memoryId);
  console.log("thingId", thingId);
  try {
    await db.$transaction(async (db) => {
      // Fetch the current state of the things array in the memory
      const memory = await db.memory.findUnique({
        where: { id: memoryId },
        select: { things: true },
      });

      // If thingId is in the memory's things array, remove it
      if (memory && memory.things.includes(thingId)) {
        await db.memory.update({
          where: { id: memoryId },
          data: {
            things: {
              set: memory.things.filter((thing) => thing !== thingId),
            },
            updateDate: new Date().toISOString(),
          },
        });
      }

      // Fetch the current state of the memories array in the thing
      const thing = await db.thing.findUnique({
        where: { id: thingId },
        select: { memories: true },
      });

      // If memoryId is in the thing's memories array, remove it
      if (thing && thing.memories.includes(memoryId)) {
        await db.thing.update({
          where: { id: thingId },
          data: {
            memories: {
              set: thing.memories.filter((memory) => memory !== memoryId),
            },
            updateDate: new Date().toISOString(),
          },
        });
      }
    });

    revalidatePath(`/memory/${memoryId}`);
    return { success: "Thing removed from memory successfully" };
  } catch (error) {
    console.error("Error removing thing from memory:", error);
    return {
      error: `Failed to remove thing from memory: ${(error as Error).message}`,
    };
  }
}

