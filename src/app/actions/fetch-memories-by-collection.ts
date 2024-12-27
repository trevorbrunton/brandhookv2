"use server";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { Collection } from "@prisma/client";

export async function fetchMemoriesByCollection(collection: Collection) {
  console.log("collection:", collection);
  try {
    const auth = await currentUser();

    if (!auth) {
      throw new Error("Unauthorized");
    }



    //fetch the memories in the collection.memory array from the memory table
    const memories = await db.memory.findMany({
      where: { id: { in: collection.memories } },
    });
    console.log("memories:", memories.length);
    return memories;
  } catch (error) {
    console.error("Error fetching memories by collection", error);
    return {
      error: `Failed to fetch memories: ${(error as Error).message}`,
    };
  }
}

