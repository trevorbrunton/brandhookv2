// Called by upload-file-format.tsx
"use server";
import { db } from "@/db";

import { revalidatePath } from "next/cache";
export async function addUserToCollection(
  userId: string,
  collectionId: string
) {
  console.log("userId", userId);
  console.log("collectionId", collectionId);
  try {
    await db.$transaction(async (db) => {
      // Fetch the current state of the collections array
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { collections: true },
      });

      // If collectionId is not in the user's collections array, add it
      if (user && !user.collections.includes(collectionId)) {
        await db.user.update({
          where: { id: userId },
          data: {
            collections: {
              push: collectionId,
            },
            updateDate: new Date().toISOString(),
          },
        });
      }

      // Fetch the current state of the users array
      const collection = await db.collection.findUnique({
        where: { id: collectionId },
        select: { users: true },
      });
      // If the user is not in the array, then add them
      if (collection && !collection.users.includes(userId)) {
        await db.collection.update({
          where: { id: collectionId },
          data: {
            users: {
              push: userId,
            },
          },
        });
      }
    });

    revalidatePath(`/collection/${collectionId}`);
    return { success: "Document saved successfully" };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      error: `Failed to save document: ${(error as Error).message}`,
    };
  }
}
