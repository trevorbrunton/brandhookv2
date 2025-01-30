import { type NextRequest, NextResponse } from "next/server"
import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from "@aws-sdk/client-transcribe"

export const maxDuration = 300 // Set to 5 minutes, adjust as needed

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType, url } = await req.json()

    if (!fileName || !fileType || !url) {
      return new NextResponse(JSON.stringify({ error: "Missing required information." }), { status: 400 })
    }

    const fileExtension = fileName.slice(-4).toLowerCase()
    console.log("File extension:", fileExtension)

    if (![".mp3", ".wav", ".m4a"].includes(fileExtension)) {
      return new NextResponse(JSON.stringify({ error: "Unsupported audio file format." }), { status: 400 })
    }

    console.log("Audio file uploaded.")
    const parsedText = await extractAudioText(url, fileName)

    console.log("Parsed text:", parsedText)

    return new NextResponse(JSON.stringify({ parsedText }), { status: 200 })
  } catch (error) {
    console.error("Error processing audio file:", error)
    return new NextResponse(JSON.stringify({ error: "An error occurred while processing the audio file." }), {
      status: 500,
    })
  }
}

const extractAudioText = async (fileURL: string, uploadedFileName: string): Promise<string> => {
  console.log("Extracting text from audio file...")

  // Initialize the AWS clients
  const transcribeClient = new TranscribeClient({
    region: process.env.AWS_BUCKET_REGION,
  })

  // Start a transcription job
  const jobName = `transcribe-job-${Date.now()}`
  await transcribeClient.send(
    new StartTranscriptionJobCommand({
      TranscriptionJobName: jobName,
      LanguageCode: "en-US", // Specify the language of the audio
      MediaFormat: uploadedFileName.endsWith(".mp3")
        ? "mp3"
        : uploadedFileName.endsWith(".wav")
        ? "wav"
        : "mp4",
      Media: {
        MediaFileUri: fileURL,
      },
      Settings: {
        ShowSpeakerLabels: true,
        MaxSpeakerLabels: 10, // Adjust this number based on your expected number of speakers
      },
      OutputBucketName: "brandhook-transcriptions", // Specify the S3 bucket for output
      OutputKey: `${jobName}.json`, // Specify the S3 key for the output file
    })
  );

  // Wait for the transcription job to complete
  let transcriptionResult = ""
  while (!transcriptionResult) {
    const { TranscriptionJob } = await transcribeClient.send(
      new GetTranscriptionJobCommand({
        TranscriptionJobName: jobName,
      }),
    )

    if (TranscriptionJob && TranscriptionJob.TranscriptionJobStatus === "COMPLETED") {
      if (!TranscriptionJob.Transcript || !TranscriptionJob.Transcript.TranscriptFileUri) {
        throw new Error("Transcript or TranscriptFileUri is undefined")
      }
      const response = await fetch(TranscriptionJob.Transcript.TranscriptFileUri)
      const data = await response.json()

      // Process the transcript with speaker labels
      const speakerSegments: { start_time: string; end_time: string; speaker_label: string }[] = data.results.speaker_labels.segments
      const items = data.results.items

      let currentSpeaker = ""

      items.forEach((item: { start_time: string; end_time: string; alternatives: { content: string }[] }) => {
        const segment = speakerSegments.find(
          (seg: { start_time: string; end_time: string; speaker_label: string }) => seg.start_time <= item.start_time && seg.end_time >= item.end_time,
        )

        if (segment && segment.speaker_label !== currentSpeaker) {
          currentSpeaker = segment.speaker_label
          transcriptionResult += `\n\n${currentSpeaker}: `
        }

        transcriptionResult += item.alternatives[0].content + " "
      })
    } else if (TranscriptionJob && TranscriptionJob.TranscriptionJobStatus === "FAILED") {
      throw new Error("Transcription job failed")
    } else {
      // Wait for 5 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  }
  console.log("Transcription job completed successfully")
  return transcriptionResult.trim()
}

