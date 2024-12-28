"use server";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function addThingsToMemory(memoryId: string, thingIds: string[]) {
  console.log("memoryId", memoryId);
  console.log("thingIds", thingIds);
  try {
    await db.$transaction(async (db) => {
      // Fetch the current state of the things array in the memory
      const memory = await db.memory.findUnique({
        where: { id: memoryId },
        select: { things: true },
      });

      // Filter out thingIds that are already in the memory's things array
      const newThingIds = thingIds.filter(
        (thingId) => !memory?.things.includes(thingId)
      );

      // Fetch the current state of the memories array for each thing
      const things = await db.thing.findMany({
        where: { id: { in: newThingIds } },
        select: { id: true, memories: true },
      });

      // Prepare updates for each thing
      const thingUpdates = things.map((thing) => ({
        where: { id: thing.id },
        data: {
          memories: {
            set: [...thing.memories, memoryId],
          },
          updateDate: new Date().toISOString(),
        },
      }));

      // Update the memory's things array and each thing's memories array in a single database write
      await db.memory.update({
        where: { id: memoryId },
        data: {
          things: {
            set: [...(memory?.things ?? []), ...newThingIds],
          },
        },
      });

      await Promise.all(
        thingUpdates.map((update) => db.thing.update(update))
      );
    });

    revalidatePath(`/memory/${memoryId}`);
    return { success: "Things added to memory successfully" };
  } catch (error) {
    console.error("Error adding things to memory:", error);
    return {
      error: `Failed to add things to memory: ${(error as Error).message}`,
    };
  }
}

