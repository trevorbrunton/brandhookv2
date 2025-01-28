"use server";

import { db } from "@/db";
import type { ProjectDocument } from "@prisma/client";

export async function fetchDocument(
  documentId: string
): Promise<ProjectDocument | null> {
  try {
    if (!db) {
      throw new Error("Database not available");
    }

    return await db.projectDocument.findUnique({
      where: { id: documentId },
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
}
