"use server";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function deleteProject(projectId: string) {

  console.log("Deleting project:", projectId);
  try {

    await db.$transaction(async (tx) => {
      // Fetch the current state of the project
      const projectData: { projectDocuments: string[], userId: string } | null = await tx.project.findUnique({
        where: { id: projectId },
        select: { projectDocuments: true, userId: true },
      });

      if (!projectData) {
        throw new Error("Project not found");
      }
    
    console.log("Project data:", projectData);

      // Delete all the documents in the projectDocuments array
      await tx.projectDocument.deleteMany({
        where: { projectDocumentId: { in: projectData.projectDocuments } },
      });

      // Delete the project
      await tx.project.delete({ where: { id: projectId } });


      revalidatePath("/home");
      return { success: true };
    });

    
      // Revalidate the cache for the projects list
     


  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      error: `Failed to delete Project: ${(error as Error).message}`,
    };
  } 
}
