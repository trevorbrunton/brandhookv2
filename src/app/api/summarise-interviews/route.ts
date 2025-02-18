import { OpenAI } from "openai";
import { type NextRequest, NextResponse } from "next/server";

export const maxDuration = 300; // Increased to 5 minutes for longer streaming

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { interviews } = body;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const systemMessage = `You are an AI assistant that is an expert in consolidating documents.`;
  const userPrompt = `Please consolidate these documents: ${interviews}. These documents are summaries of interview transcriptions (called "Conversations") were the interviewees were asked questions about their lifesytle, interests, work habits, then asked specific questions about hypotheses that were being tested by the interviewer.  You need to merge the documents into one document, with the following sections: a) Summary b)Overal themes c)Questions from conversations d) detailed hypothesis summary .  In each section, write paragraphs that explain the themes, trends  and insights of contained and provide analysis and an appropriate heading.  Where sections relate to a hypothesis, please createa a sub-section for each hypothesis, summarise the hypothesis, the intervievee's thoughts and provide analysis and insights.  Please write at least 200 words for each section. The overall heading for the document should be "Customer Conversations Summary". Please format the document as a markdown file that is left aligned with no indents.`;

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userPrompt },
    ],
    stream: true,
  });

  const encoder = new TextEncoder();

  return new NextResponse(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}
