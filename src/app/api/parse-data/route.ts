import PDFParser from "pdf2json";
import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { nanoid } from "@/lib/utils";
import { extractRawText } from "mammoth";
import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} from "@aws-sdk/client-transcribe";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const uploadedFile = formData.get("theFile") as Blob | null;
    const uploadedFileName = formData.get("fileName") as string | null;
    const url = formData.get("url") as string | null;

    console.log("Uploaded file:", uploadedFileName);
    if (uploadedFile) {
      console.log("Uploaded file size:", uploadedFile.size);
    }

    if (!uploadedFile || !uploadedFileName) {
      return new NextResponse(
        JSON.stringify({ error: "No file was uploaded." }),
        { status: 400 }
      );
    }

    const fileName = nanoid();
    const tempFilePath = `/tmp/${fileName}`;
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
    await fs.writeFile(tempFilePath, fileBuffer);

    const fileExtension = uploadedFileName.slice(-4).toLowerCase();
    console.log("File extension:", fileExtension);
    let parsedText = "";

    switch (fileExtension) {
      case ".pdf":
        parsedText = await parsePDF(tempFilePath);
        break;
      case "docx":
      case ".doc":
        console.log("Parsing Word document...");
        parsedText = await parseWord(fileBuffer);
        break;
      case ".mp3":
      case ".wav":
      case ".m4a":
        console.log("Audio file uploaded.");
        if (url) {
          parsedText = await extractAudioText(url.toString(), uploadedFileName);
        } else {
          throw new Error("File URL or File Name is missing");
        }
        break;
      default:
        return new NextResponse(
          JSON.stringify({ error: "Unsupported file format." }),
          { status: 400 }
        );
    }

    // Clean up the temporary file
    await fs.unlink(tempFilePath);

    console.log("Parsed text:", parsedText);

    return new NextResponse(JSON.stringify({ parsedText }), { status: 200 });
  } catch (error) {
    console.error("Error processing file:", error);
    return new NextResponse(
      JSON.stringify({ error: "An error occurred while processing the file." }),
      { status: 500 }
    );
  }
}

async function parsePDF(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true);
    pdfParser.on("pdfParser_dataError", reject);
    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent());
    });
    pdfParser.loadPDF(filePath);
  });
}

async function parseWord(buffer: Buffer): Promise<string> {
  const { value } = await extractRawText({ buffer });
  return value;
}

const extractAudioText = async (
  fileURL: string,
  uploadedFileName: string
): Promise<string> => {
  console.log("Extracting text from audio file...");

  // Initialize the AWS clients
  const transcribeClient = new TranscribeClient({
    region: process.env["AWS_BUCKET_REGION"], // Replace with your preferred region
  });
  // Start a transcription job
  const jobName = `transcribe-job-${Date.now()}`;
  await transcribeClient.send(
    new StartTranscriptionJobCommand({
      TranscriptionJobName: jobName,
      LanguageCode: "en-US", // Specify the language of the audio
      MediaFormat: uploadedFileName.endsWith(".mp3") ? "mp3" : "wav", // Adjust based on the file type  ///include m4a***********
      Media: {
        MediaFileUri: `s3://cronicle-file-uploads/${uploadedFileName}`,
      },
      Settings: {
        ShowSpeakerLabels: true,
        MaxSpeakerLabels: 10, // Adjust this number based on your expected number of speakers
      },
    })
  );

  // Wait for the transcription job to complete
  let transcriptionResult: string | undefined;
  while (!transcriptionResult) {
    const { TranscriptionJob } = await transcribeClient.send(
      new GetTranscriptionJobCommand({
        TranscriptionJobName: jobName,
      })
    );

    if (
      TranscriptionJob &&
      TranscriptionJob.TranscriptionJobStatus === "COMPLETED"
    ) {
      if (
        !TranscriptionJob.Transcript ||
        !TranscriptionJob.Transcript.TranscriptFileUri
      ) {
        throw new Error("Transcript or TranscriptFileUri is undefined");
      }
      const response = await fetch(
        TranscriptionJob.Transcript.TranscriptFileUri
      );
      const data = await response.json();

      // Process the transcript with speaker labels
      const speakerSegments = data.results.speaker_labels.segments;
      const items = data.results.items;

      let currentSpeaker = "";

      interface SpeakerSegment {
        start_time: number;
        end_time: number;
        speaker_label: string;
      }

      interface Item {
        start_time: number;
        end_time: number;
        alternatives: { content: string }[];
      }

  

      items.forEach((item: Item) => {
        const segment = speakerSegments.find(
          (seg: SpeakerSegment) =>
            seg.start_time <= item.start_time && seg.end_time >= item.end_time
        );

        if (segment && segment.speaker_label !== currentSpeaker) {
          currentSpeaker = segment.speaker_label;
          transcriptionResult += `\n\n${currentSpeaker}: `;
        }

        transcriptionResult += item.alternatives[0].content + " ";
      });
    } else if (
      TranscriptionJob &&
      TranscriptionJob.TranscriptionJobStatus === "FAILED"
    ) {
      throw new Error("Transcription job failed");
    } else {
      // Wait for 5 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  console.log("Transcription job completed successfully");
  return transcriptionResult.trim();
};
