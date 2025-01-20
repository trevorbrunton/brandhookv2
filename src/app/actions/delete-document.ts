// Purpose: Fetch a ProjectDocument from the database.
// THIS HAS NOT BEEN IMPLEMENTED YET - CODE IS FROM FETCH-ProjectDocument.TS
//  DO I NEED THIS???

"use server";
import { db } from "@/db";
import { ProjectDocument, Project } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function deleteDocument(
  documentId: string,
  projectId: string
) {
  try {
    if (!db) {
      throw new Error("Database not available");
    } else {
      const projects = db.collection("projects");
      const project = await projects.findOne({ projectId: projectId }) as unknown as Project;
      const documents: ProjectDocument[] = project.projectDocuments || [];
      console.log("bang")
      // Filter out the document to be deleted  from the projectDocuments array
      const newDocuments = documents.filter(
        (doc: ProjectDocument) => doc.id !== documentId
      );
      // Update the project with the new projectDocuments array
      await projects.updateOne(
        { projectId: projectId },
        { $set: { projectDocuments: newDocuments } }
      );
    revalidatePath(`/project-view/${projectId}`);
      return { success: "Document Deleted" };
    }
  } catch (e) {
    console.error(e);
    return { error: "Database fetch failed" };
  }
}
