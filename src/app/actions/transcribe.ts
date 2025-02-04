"use server";

import { nanoid } from "@/lib/utils";
import { db } from "@/db";
import { createJob } from "@/app/actions/create-job";

export async function transcribe(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const jobId = nanoid();

  const lambdaUrl =
    "https://r9rxcod525.execute-api.ap-southeast-2.amazonaws.com/default/start-transcribe-job";
  const payload = {
    jobId,
    projectId: "1234",
    userId: user.id,
    title: "My Project",
    interviewee: "Jane Doe",
    docType: "interview",
    fileUrl:
      "https://bh-transcribe-jobs.s3.ap-southeast-2.amazonaws.com/Dean-St.m4a",
  };

  try {
    const response = await fetch(lambdaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Request sent to Lambda: ", payload);

    if (!response.ok) {
      throw new Error(
        `HTTP error! in post status: ${response.status} ${response.statusText}`
      );
    }
    const job = await createJob("1234", jobId);
    console.log("job start", job);

    return jobId;
  } catch (error) {
    console.error("Error calling Lambda function:", error);
    throw error;
  }
}
