"use server";

import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createPlace(name: string) {
  console.log("Creating place", name);
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

  const newPlace = await db.place.create({
    data: {
      userId: user.id,
      name,
      geolocation: "",
      memories: [],
      people: [],
      events: [],
      createDate: new Date().toISOString(),
      updateDate: new Date().toISOString(),
    },
  });
  revalidatePath(`/view-place/${newPlace.id}`);

  return newPlace;
}

