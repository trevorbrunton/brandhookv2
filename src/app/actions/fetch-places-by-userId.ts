"use server";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";

export async function fetchPlacesByUserId() {
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

    const places = await db.place.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
    });
    return places;
  } catch (error) {
    console.error("Error fetching places by userId:", error);
    return {
      error: `Failed to fetch places by userId: ${(error as Error).message}`,
    };
  }
}

