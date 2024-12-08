// Called by upload-file-format.tsx
"use server";
import { db } from "@/db";

import { revalidatePath } from "next/cache";
export async function addCollectionToUser(
  userId: string,
  collectionId: string
) {
  console.log("userId", userId);
  console.log("collectionId", collectionId);
  try {
    // await db.$transaction(async (prisma) => {
    // Update the User's collections array
    await db.user.update({
      where: { id: userId },
      data: {
        collections: {
          push: collectionId,
        },
      },
    });
    await db.collection.update({
      where: { id: collectionId },
      data: {
        users: {
          push: userId,
        },
      },
    });
    // });
    revalidatePath(`/collection/${collectionId}`);
    return { success: "Document saved successfully" };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      error: `Failed to save document: ${(error as Error).message}`,
    };
  }
}
