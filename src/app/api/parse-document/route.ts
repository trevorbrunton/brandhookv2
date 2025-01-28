import { type NextRequest, NextResponse } from "next/server"
import PDFParser from "pdf2json"
import { extractRawText } from "mammoth"

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType, url } = await req.json()

    if (!fileName || !fileType || !url) {
      return new NextResponse(JSON.stringify({ error: "Missing required information." }), { status: 400 })
    }

    const fileExtension = fileName.slice(-4).toLowerCase()
    console.log("File extension:", fileExtension)
    let parsedText = ""

    switch (fileExtension) {
      case ".pdf":
        parsedText = await parsePDF(url)
        break
      case "docx":
      case ".doc":
        console.log("Parsing Word document...")
        parsedText = await parseWord(url)
        break
      default:
        return new NextResponse(JSON.stringify({ error: "Unsupported file format." }), { status: 400 })
    }

    console.log("Parsed text:", parsedText)

    return new NextResponse(JSON.stringify({ parsedText }), { status: 200 })
  } catch (error) {
    console.error("Error processing file:", error)
    return new NextResponse(JSON.stringify({ error: "An error occurred while processing the file." }), { status: 500 })
  }
}

async function parsePDF(url: string): Promise<string> {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const pdfParser = new PDFParser(null, true)
  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", reject)
    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent())
    })
    pdfParser.parseBuffer(Buffer.from(arrayBuffer))
  })
}

async function parseWord(url: string): Promise<string> {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const { value } = await extractRawText({ buffer: Buffer.from(arrayBuffer) })
  return value
}

