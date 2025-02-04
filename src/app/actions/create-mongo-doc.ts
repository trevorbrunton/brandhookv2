"use server"

import { db } from "@/db"

export async function createMongoDoc(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const lambdaUrl =
    "https://z613w52nog.execute-api.ap-southeast-2.amazonaws.com/dev/create-doc";
  const payload = {
    projectId: "1234",
    userId: user.id,
    title: "My Project",
    interviewee: "Jane Doe",
    content: "",
    fileUrl: "",
    docType: "interview",
  }

  try {
    const response = await fetch(lambdaUrl, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
    
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Lambda response:", data)
    return data
  } catch (error) {
    console.error("Error calling Lambda function:", error)
    throw error
  }
}

