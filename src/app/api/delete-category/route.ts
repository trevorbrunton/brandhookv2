import { NextResponse } from "next/server";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
 
const CategoryName = z.object({
  name: z.string(),
});

export async function POST(req:Request) {
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
      const  eventCategory = await req.json();
      const category = CategoryName.parse(eventCategory);
      if (!category) {
        console.log("Parse failed");
        return new NextResponse(
          JSON.stringify({
            error: "Invalid category",
          }),
          { status: 400 }
        );
      }
      await db.eventCategory.delete({
        where: {
          name_userId: { name: category.name, userId: auth.id },
        },
      });

      return new NextResponse(
        JSON.stringify({
          success: true
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
