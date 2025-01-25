"use server";
import { db } from "@/db";

export async function fetchUserByUserId(userId: string) {
  try {
    if (!db) {
      throw new Error("Database not available");
    }
    const user = await db.user.findFirst({ where: { id: userId } });

    return user;
  } catch (e) {
    console.error(e);
    throw new Error("Database fetch failed");
  }
}
