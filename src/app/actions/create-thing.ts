"use server";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createThing(name: string) {
  try {
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
    const newThing = await db.thing.create({
      data: {
        userId: user.id,
        name,
        createDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
        memories: [],
        events: [],
        places: [],
        picUrl: "",
      },
    });

    revalidatePath("/things");
    return { success: "Thing created successfully", id: newThing.id };
  } catch (error) {
    console.error("Error creating thing:", error);
    return {
      error: `Failed to create thing: ${(error as Error).message}`,
    };
  }
}

