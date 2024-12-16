"use server";

import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updatePersonDetails(
  personId: string,
  name: string,
  dateOfBirth: string,
  picUrl: string
) {
  console.log("Creating person", name);
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

  const newPerson = await db.person.update({
    where: { id: personId },
    data: {
      name,
      dateOfBirth,
      picUrl,
      updateDate: new Date().toISOString(),
    },
  });
  revalidatePath(`/view-person/${newPerson.id}`);

  return newPerson;
}
