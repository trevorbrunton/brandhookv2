"use server";
import { db } from "@/db";

export async function fetchUserFromExternalId(id: string) {

  try {
    if (!db) {
      throw new Error("Database not available");
    }
    const user = await db.user.findFirst(
      {where: {externalId: id}}
    );
    console.log("User record: ",user);

    return user;
  } catch (e) {
    console.error(e);
    throw new Error("Database fetch failed");
  }
}
