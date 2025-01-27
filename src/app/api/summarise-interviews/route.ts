import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";


export const maxDuration = 30;
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { interviews } = body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const systemMessage = `You are an AI assistant that is an expert in consolidating documents.`;
    const userPrompt = `Please consolidate these documents: ${interviews}. You need to merge the documents by section into one document, following the structure of the original document.  Please write at least 200 words for each section. The heading for the document should be "Customer Conversations Summary".`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      model: "gpt-4o-mini",
    });
    const message = completion.choices[0].message.content;

    return new NextResponse(
      JSON.stringify({ success: "Project summarised correctly", message }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        error: "An error occurred while summarising the project",
      }),
      { status: 500 }
    );
  }
}
