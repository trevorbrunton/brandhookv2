"use server";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";

export async function fetchPeopleByUserId() {
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

    const people = await db.person.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
    });
    return people;
  } catch (error) {
    console.error("Error fetching user by Id:", error);
    return {
      error: `Failed to fetch user by Id: ${(error as Error).message}`,
    };
  }
}
