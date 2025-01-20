// Called by upload-file-format.tsx
"use server";
import { db } from "@/db";
import type { ProjectDocument as PrismaProjectDocument } from "@prisma/client";

interface ProjectDocument extends Omit<PrismaProjectDocument, "id"> {
  id?: string;
}
import { revalidatePath } from "next/cache";

export async function saveDocToDb(doc: ProjectDocument, projectId: string) {
  try {
    if (!db) {
      throw new Error("Database connection not available");
    }

    console.log("Saving document to database:", doc);
    console.log("Project ID:", projectId);

    // Remove the id field if it's an empty string
    const { id, ...docWithoutId } = doc;
    const documentData = id ? doc : docWithoutId;

    const projectDocument = await db.projectDocument.create({
      data: documentData,
    });

    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (project) {
      await db.project.update({
        where: { id: projectId },
        data: {
          projectDocuments: {
            push: projectDocument.id,
          },
          updateDate: new Date().toLocaleDateString("eu-AU"),
        },
      });
    }

    revalidatePath(`/project-view/${projectId}`);
    return { success: "Document saved successfully" };
  } catch (error) {
    console.error("Database operation failed:", error);
    return { error: `Failed to save document: ${(error as Error).message}` };
  }
}
