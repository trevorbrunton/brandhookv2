"use server";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function deleteDocument(documentId: string, projectId: string) {
  try {
    // Delete the document
    await db.projectDocument.delete({ where: { id: documentId } });

    revalidatePath(`/project-view/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      error: `Failed to delete Project: ${(error as Error).message}`,
    };
  }
}
