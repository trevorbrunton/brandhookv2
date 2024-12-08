// Called by upload-file-format.tsx
"use server";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function removeUserFromCollection(
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

      // If collectionId is in the user's collections array, remove it
      if (user && user.collections.includes(collectionId)) {
        await db.user.update({
          where: { id: userId },
          data: {
            collections: {
              set: user.collections.filter((id) => id !== collectionId),
            },
          },
        });
      }

      // Fetch the current state of the users array
      const collection = await db.collection.findUnique({
        where: { id: collectionId },
        select: { users: true },
      });

      // If userId is in the collection's users array, remove it
      if (collection && collection.users.includes(userId)) {
        await db.collection.update({
          where: { id: collectionId },
          data: {
            users: {
              set: collection.users.filter((id) => id !== userId),
            },
          },
        });
      }
    });

    revalidatePath(`/collection/${collectionId}`);
    return { success: "User removed from collection successfully" };
  } catch (error) {
    console.error("Error removing user from collection:", error);
    return {
      error: `Failed to remove user from collection: ${
        (error as Error).message
      }`,
    };
  }
}
