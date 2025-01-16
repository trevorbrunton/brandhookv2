"use server";

import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { nanoid } from "@/lib/utils";

export async function createProject(
  projectName: string,
  projectDetails: string
) {
    const today = new Date().toLocaleDateString("en-AU");
  try {
    console.log("Creating person", projectName);
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

    const newProject = await db.project.create({
      data: {
        projectId: nanoid(),
        userId: user.id,
        projectName,
        projectDetails,
        projectDocuments: [],
        createDate: today,
        updateDate: today,
      },
    });

    return newProject;
  } catch (error) {
    console.error("Error creating person:", error);
    return {
      error: `Failed to create person: ${(error as Error).message}`,
    };
  }
}
