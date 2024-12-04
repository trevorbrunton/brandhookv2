import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const collectionId = searchParams.get("collectionId");
    console.log("collectionId from api", collectionId);
    const auth = await currentUser();
    console.log("auth", auth);
    if (!auth) {
      return new NextResponse(
        JSON.stringify({
          error: "User not authenticated",
        }),
        { status: 401 }
      );
    }
    if (!collectionId) {
      return new NextResponse(
        JSON.stringify({
          error: "Collection ID is required",
        }),
        { status: 400 }
      );
    }
    
    const userEmail = auth.emailAddresses[0].emailAddress;
    const collection = await db.collection.findFirst({
      where: { collectionId: collectionId, userEmail: userEmail },
      include: { memories: true },
    });

    return new NextResponse(
      JSON.stringify({
        success: collection,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        error: "An error occurred while attempting to create checkout session",
      }),
      { status: 500 }
    );
  }
}
