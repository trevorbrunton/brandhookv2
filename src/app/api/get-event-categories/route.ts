import { NextResponse } from "next/server";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const auth = await currentUser();
    if (!auth) {
      return new NextResponse(
        JSON.stringify({
          error: "User not authenticated",
        }),
        { status: 401 }
      );
    }
      const categories = await db.eventCategory.findMany({
        where: { userId: auth.id },
        orderBy: { updatedAt: "desc" },
      });
      console.log("Result of query", categories);

      return new NextResponse(
        JSON.stringify({
          categories,
        }),
        { status: 200 }
      );
    
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        error: "An error occurred while attempting to fetch event categories",
      }),
      { status: 500 }
    );
  }
}
