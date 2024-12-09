import {  NextResponse } from "next/server";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { nanoid } from "@/lib/utils";

export async function GET() {
  try {
    const auth = await currentUser();
    if (!auth) {
      return new NextResponse(
        JSON.stringify({
          isSynced: false,
        }),
        { status: 200 }
      );
    }

    const user = await db.user.findFirst({
      where: { externalId: auth.id },
    });

    console.log("USER IN DB:", user);
    const defaultCollection = nanoid()

    if (!user) {
      const newUser = await db.user.create({
        data: {
          externalId: auth.id,
          email: auth.emailAddresses[0].emailAddress,
          defaultCollection: defaultCollection,
          quotaLimit: 100, 
          collections: []
        },
      });

      await db.collection.create({
        data: {
          collectionId: defaultCollection,
          collectionName: "Recent Uploads",
          collectionDetails: "A collection of your most recent uploads",
          userId: newUser.id,
          userEmail: newUser.email,
          users: [],
          createDate: new Date().toISOString(),
          updateDate: new Date().toISOString(),
        },
      });
    }

    return new NextResponse(
      JSON.stringify({
        isSynced: true,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        error: "An error occurred while attempting to create user record",
      }),
      { status: 500 }
    );
  }
}
