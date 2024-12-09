import { NextResponse } from 'next/server'
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"

export async function GET() {
  const auth = await currentUser()

  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const collections = await db.collection.findMany({
    where: { userId: user.id },
    select: { id: true, collectionName: true, collectionId: true },
  })

  return NextResponse.json(collections)
}

