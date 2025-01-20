// Purpose: Fetch a ProjectDocument from the database.
// THIS HAS NOT BEEN IMPLEMENTED YET - CODE IS FROM FETCH-ProjectDocument.TS
//  DO I NEED THIS???

"use server";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function deleteDocument(documentId: string, projectId: string) {
  try {
    await db.$transaction(async (tx) => {
      // Fetch the current state of the project
      const projectData: { projectDocuments: string[]; userId: string } | null =
        await tx.project.findUnique({
          where: { id: projectId },
          select: { projectDocuments: true, userId: true },
        });

      if (!projectData) {
        throw new Error("Project not found");
      }

      // delete projectID from projectDocuments array
      const newProjectDocuments = projectData.projectDocuments.filter(
        (docId) => docId !== documentId
      );

      // Delete the document
      await tx.projectDocument.delete({ where: { id: documentId } });

      // Update the project with the new projectDocuments array
      await tx.project.update({
        where: { id: projectId },
        data: { projectDocuments: newProjectDocuments },
      });

      revalidatePath(`/project-view/${projectId}`);
      return { success: true };
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      error: `Failed to delete Project: ${(error as Error).message}`,
    };
  }
}
