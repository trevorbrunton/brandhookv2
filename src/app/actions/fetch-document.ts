"use server";
import { db } from "@/db";

export async function fetchDocument(documentId: string) {
    console.log("fetchDocument" , documentId);
  try {
    if (!db) {
      throw new Error("Database not available");
    }
    const document = await db.projectDocument.findFirst(
      {where: {id: documentId}}
    );

    return { success: document };
  } catch (e) {
    console.error(e);
    return { error: "Database fetch failed" };
  }
}
