"use server";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function addPeopleToMemory(memoryId: string, personIds: string[]) {
  console.log("memoryId", memoryId);
  console.log("personIds", personIds);
  try {
    await db.$transaction(async (db) => {
      // Fetch the current state of the people array in the memory
      const memory = await db.memory.findUnique({
        where: { id: memoryId },
        select: { people: true },
      });

      // Filter out personIds that are already in the memory's people array
      const newPersonIds = personIds.filter(
        (personId) => !memory?.people.includes(personId)
      );

      // Fetch the current state of the memories array for each person
      const people = await db.person.findMany({
        where: { id: { in: newPersonIds } },
        select: { id: true, memories: true },
      });

      // Prepare updates for each person
      const personUpdates = people.map((person) => ({
        where: { id: person.id },
        data: {
          memories: {
            set: [...person.memories, memoryId],
          },
          updateDate: new Date().toISOString(),
        },
      }));

      // Update the memory's people array and each person's memories array in a single database write
      await db.memory.update({
        where: { id: memoryId },
        data: {
          people: {
            set: [...(memory?.people ?? []), ...newPersonIds],
          },
        },
      });

      await Promise.all(
        personUpdates.map((update) => db.person.update(update))
      );
    });

    revalidatePath(`/memory/${memoryId}`);
    return { success: "People added to memory successfully" };
  } catch (error) {
    console.error("Error adding people to memory:", error);
    return {
      error: `Failed to add people to memory: ${(error as Error).message}`,
    };
  }
}
