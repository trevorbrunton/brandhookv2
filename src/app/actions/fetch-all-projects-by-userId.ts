"use server";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";

export async function fetchAllProjectsByUserId() {
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

    const projects = await db.project.findMany({
      where: { userId: user.id },
    });

    return projects;
  } catch (error) {
    console.error("Error fetching documents by projectId:", error);
    return {
      error: `Failed to fetch documents by projectId: ${
        (error as Error).message
      }`,
    };
  }
}
