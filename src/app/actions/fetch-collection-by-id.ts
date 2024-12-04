"use server";
import { db } from "@/db";


export async function fetchCollectionById(collectionId: string) {
  try {
    if (!db) {
      throw new Error("Database not available");
    } else {

      const results = await db.collection.findFirst({ where: { collectionId: collectionId }, include : { memories: true } });
      return { success: results };
    }
  } catch (e) {
    console.error(e);
    const theError = e as Error;
    return { error: theError.message };
  }
}
