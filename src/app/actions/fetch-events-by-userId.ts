"use server";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";

export async function fetchEventsByUserId() {
  try {
    const auth = await currentUser();

    if (!auth) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: { externalId: auth.id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const events = await db.event.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
    });
    return events;
  } catch (error) {
    console.error("Error fetching events by userId:", error);
    return {
      error: `Failed to fetch events by userId: ${(error as Error).message}`,
    };
  }
}

