"use server";

import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateMemoryDetails(memoryId: string, people: string[], event: string, place: string) {
  const auth = await currentUser();
  if (!auth) {
    throw new Error("Not authenticated");
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const newPerson = await db.memory.update({
    where: { id: memoryId },
    data: {
      people,
      updateDate: new Date().toISOString(),
      event,
      place,
    },
  });
  revalidatePath(`/view-memory/${memoryId}`);

  return newPerson;
}
