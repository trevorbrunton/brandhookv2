"use server";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function updateBusinessDetails(
  userId: string,
  businessDetails: string,
  businessStage: string,
  marketChannel: string
) {
  try {
    console.log(userId, businessDetails, businessStage, marketChannel);

    if (!db) {
      throw new Error("client not available");
    }
 

    await db.user.update({
      where: { id: userId },
      data: {
        businessDetails: businessDetails,
        businessStage: businessStage,
        marketChannel: marketChannel,
        updateDate: new Date().toISOString(),
      },
    });
    revalidatePath("/settings");
  } catch (e) {
    console.error(e);
  }
}
