//DEVNOTE: NEEDS TO BE UPDATED  TO REMOVE PEOPLE FROM MEMORIES



"use server";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function removePersonFromMemory(
  memoryId: string,
  personId: string
) {
  console.log("memoryId", memoryId);
  console.log("personId", personId);
  try {
    await db.$transaction(async (db) => {
      // Fetch the current state of the people array in the memory
      const memory = await db.memory.findUnique({
        where: { id: memoryId },
        select: { people: true },
      });

      // If personId is in the memory's people array, remove it
      if (memory && memory.people.includes(personId)) {
        await db.memory.update({
          where: { id: memoryId },
          data: {
            people: {
              set: memory.people.filter((person) => person !== personId),
            },
            updateDate: new Date().toISOString(),
          },
        });
      }

      // Fetch the current state of the memories array in the person
      const person = await db.person.findUnique({
        where: { id: personId },
        select: { memories: true },
      });

      // If memoryId is in the person's memories array, remove it
      if (person && person.memories.includes(memoryId)) {
        await db.person.update({
          where: { id: personId },
          data: {
            memories: {
              set: person.memories.filter((memory) => memory !== memoryId),
            },
            updateDate: new Date().toISOString(),
          },
        });
      }
    });

    revalidatePath(`/memory/${memoryId}`);
    return { success: "Person removed from memory successfully" };
  } catch (error) {
    console.error("Error removing person from memory:", error);
    return {
      error: `Failed to remove person from memory: ${(error as Error).message}`,
    };
  }
}
