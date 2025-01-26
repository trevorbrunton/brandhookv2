import  PDFParser  from "pdf2json";
import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { nanoid } from "@/lib/utils";
import { extractRawText } from "mammoth";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const uploadedFile = formData.get("theFile") as Blob | null;
    const uploadedFileName = formData.get("fileName") as string | null;

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
        // const pdfParser = new (PDFParser as any)(null, 1);

        // pdfParser.on("pdfParser_dataError", (errData: any) =>
        //   console.log(errData.parserError)
        // );

        // pdfParser.on("pdfParser_dataReady", () => {
        //   parsedText = (pdfParser as any).getRawTextContent();
        // });

        // await new Promise((resolve, reject) => {
        //   pdfParser.loadPDF(tempFilePath);
        //   pdfParser.on("pdfParser_dataReady", resolve);
        //   pdfParser.on("pdfParser_dataError", reject);
        // });
        parsedText = await parsePDF(tempFilePath);
        break;
      case "docx":
      case ".doc":
        console.log("Parsing Word document...");
        parsedText = await parseWord(fileBuffer);
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
