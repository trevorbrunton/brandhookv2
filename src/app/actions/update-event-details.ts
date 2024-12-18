"use server";

import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateEventDetails(
  eventId: string,
  name: string,
  dateOfEvent: string,
  picUrl: string
) {
  console.log("Updating event", name);
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

  const updatedEvent = await db.event.update({
    where: { id: eventId },
    data: {
      name,
      dateOfEvent,
      picUrl,
      updateDate: new Date().toISOString(),
    },
  });
  revalidatePath(`/view-event/${updatedEvent.id}`);

  return updatedEvent;
}

