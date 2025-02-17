import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";


export const maxDuration = 30;
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wows } = body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const systemMessage = `You are an AI assistant that is an expert in consolidating and summarsing documents.`;
    const userPrompt = `Please consolidate these documents: ${wows}. These documents contain short insights captured by an interviewer by reading over interview transcripts.  These insights are called "Wow Moments" Please extract all similar observations and themes from the documents and sumarise and provide analysis and insights from each document and summarise into a number of document sections with an appropriate heading that captures the theme for each section.  Please write at least 200 words for each section. The overall heading for the document should be "Wow Moments Summary".  Please left format the document with no indents.`;

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
