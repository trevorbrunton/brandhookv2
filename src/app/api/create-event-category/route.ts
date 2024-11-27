import { NextResponse } from "next/server";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { parseColor } from "@/lib/utils";

const ParamsSchema = z.object({
  name: z.string().min(1),
  color: z.string().min(1).regex(/^#[0-9A-F]{6}$/i),
  emoji: z.string().optional(),
});

export async function POST(req: Request) {
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
      const params = await req.json();
      const parsedParams = ParamsSchema.safeParse(params);
      if (!parsedParams.success) {
        return new NextResponse(
          JSON.stringify({
            error: "Invalid query parameters",
          }),
          { status: 400 }
        );
      }
      const eventCategory = await db.eventCategory.create({
        data: {
          name: parsedParams.data.name.toLowerCase(),
          color: parseColor(parsedParams.data.color),
          emoji: parsedParams.data.emoji,
          userId: auth.id,
        },
      });
    
    console.log(eventCategory);

      return new NextResponse(
        JSON.stringify({
          eventCategory
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
