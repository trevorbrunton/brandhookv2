"use server";

import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createEvent(name: string) {
  console.log("Creating event", name);
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

  const newEvent = await db.event.create({
    data: {
      userId: user.id,
      name,
      dateOfEvent: "",
      memories: [],
      people: [],
      place: null,
      createDate: new Date().toISOString(),
      updateDate: new Date().toISOString(),
    },
  });
  revalidatePath(`/view-event/${newEvent.id}`);

  return newEvent;
}

