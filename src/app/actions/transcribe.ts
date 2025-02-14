"use server";

import { nanoid } from "@/lib/utils";
import { db } from "@/db";
import { createJob } from "@/app/actions/create-job";

export async function transcribe(
  userId: string,
  projectId: string,
  title: string,
  interviewee: string,
  fileUrl: string,
  activeDocClass: string
) {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  console.log("Starting transcription job");

  console.log("doctype", activeDocClass);

  const jobId = nanoid();

  const lambdaUrl =
    "https://r9rxcod525.execute-api.ap-southeast-2.amazonaws.com/default/start-transcribe-job";
  const payload = {
    jobId,
    projectId: projectId,
    userId: user.id,
    title: title,
    interviewee: interviewee,
    docType: activeDocClass,
    fileUrl: fileUrl,
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
    const job = await createJob(projectId, jobId);
    console.log("Transcription job has started", job);

    return jobId;
  } catch (error) {
    console.error("Error calling Lambda function:", error);
    throw error;
  }
}
