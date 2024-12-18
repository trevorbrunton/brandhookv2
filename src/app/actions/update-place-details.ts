"use server";

import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updatePlaceDetails(
  placeId: string,
  name: string,
  geolocation: string,
  picUrl: string
) {
  console.log("Updating place", name);
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

  const updatedPlace = await db.place.update({
    where: { id: placeId },
    data: {
      name,
      geolocation,
      picUrl,
      updateDate: new Date().toISOString(),
    },
  });
  revalidatePath(`/view-place/${updatedPlace.id}`);

  return updatedPlace;
}

