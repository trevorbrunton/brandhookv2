import {  NextResponse } from "next/server";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";

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

    if (!user) {
      await db.user.create({
        data: {
          quotaLimit: 100,
          externalId: auth.id,
          email: auth.emailAddresses[0].emailAddress,
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
