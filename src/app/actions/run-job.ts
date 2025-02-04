    "use server"

import { nanoid } from "@/lib/utils";
import { db } from "@/db";

export async function runJob(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const jobId = nanoid();

  const lambdaUrl =
    "https://7vtb7rdpif.execute-api.ap-southeast-2.amazonaws.com/default/record-job-details";
  const payload = {
    jobId,
    projectId: "1234",
    userId: user.id,
    title: "My Project",
    interviewee: "Jane Doe",
    docType: "interview",
  };

  try {
    const response = await fetch(lambdaUrl, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
    
      },
      body: JSON.stringify(payload),
    });

    console.log("Request sent to Lambda: ", payload)

    if (!response.ok) {
      throw new Error(`HTTP error! in post status: ${response.status} ${response.statusText}`)
    }

    const result = await fetch(
      `https://i8ubtu6mo0.execute-api.ap-southeast-2.amazonaws.com/default/get-job-details?jobId=${jobId}`,
    );

    if (!result.ok) {
      throw new Error(`HTTP error! in get status: ${result.status} ${result.statusText}`)
    }
    const jobDetails = await result.json();



    console.log("Lambda response:", jobDetails)
    return result
  } catch (error) {
    console.error("Error calling Lambda function:", error)
    throw error
  }
}

