import { NextResponse } from "next/server";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    console.log("blah")
  try {
    const auth = await currentUser();

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { externalId: auth.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

      const { memoryId, collectionId } = await req.json();
      
      console.log('memoryId', memoryId)
        console.log('collectionId', collectionId)

    // const memory = await db.memory.findUnique({
    //   where: { id: memoryId},
    // });

    // if (!memory) {
    //   return new NextResponse("Memory not found", { status: 404 });
    // }

    // const collection = await db.collection.findUnique({
    //   where: { id: collectionId, userId: user.id },
    // });

    // if (!collection) {
    //   return new NextResponse("Collection not found", { status: 404 });
    // }

    const updatedMemory = await db.memory.update({
      where: { id: memoryId },
      data: { collectionId },
    });

    return NextResponse.json(updatedMemory);
  } catch (error) {
    console.error("[ADD_TO_COLLECTION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
