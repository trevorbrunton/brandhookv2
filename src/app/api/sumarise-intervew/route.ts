import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { parsedText } = body;

    if (!parsedText) {
      return new NextResponse(
        JSON.stringify({ error: "No text was provided." }),
        { status: 400 }
      );
    }
      
    const interviewSummary = await produceSummary(parsedText);


    return new NextResponse(
      JSON.stringify({ success: "Project summarised correctly", interviewSummary: interviewSummary }),
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

/**
 * Produces a summary of the given parsed text using an AI model.
 *
 * @param {string} parsedText - The text to be summarized.
 * @returns {Promise<string>} - A promise that resolves to the summary text.
 *
 * The function uses the OpenAI GPT-4 model to generate a summary of the provided interview text.
 * It constructs a prompt for the AI model, specifying the task of summarizing the interview.
 * The AI model is instructed to extract key points and major themes from the interview and produce the output in markdown format.
 */
async function produceSummary(parsedText: string): Promise<string> {
  const prompt = `Summarise the following interview: ${parsedText}.
  Here is the conversation guide format: 
  Introduction - question about daily life, enjoyable aspects, challenges, changes
  Issue Exploration - thoughts on business issue, positive/negative aspects, emerging trends
  Product Category - factors for choosing product, essential attributes for success/failure
  Competing Brands - brands associated with category, attributes that stand out
  Competing Brand Experience - brands used/interacted with, factors for switching brands
  Experience with Your Brand - first encounter with brand, attributes that drew you to it
  Your Brand Attributes - strengths and weaknesses of product, standout attributes
  Brand Improvements - suggestions for product improvement, changes to formulation/packaging
  Hypothesis Exploration - questions about some specific hypotheses
`;

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: `This is a transcript from a customer conversation I had using the attached Conversation Guide guide Can you please summarise the transcript using this format: 1. Summary Give me a 3 paragraph summary of the conversation overall. 2. Overall Themes (communicated as Actions) Secondly, give me the overall themes of the conversation as 5 bullet points but these must be actioned oriented so that the it gives me some ideas for the business to move forward on. Please write at least 200 words per bullet point 3. Summary of Hypotheses The third thing is a summary of the hypotheses which are usually asked at the end of the conversation. Refer to the Conversation Guide for the questions and give me the answers. Please write at least 200 words for each hypothesis 4. Summary Of Conversation Guide [in the project & following the question prompts] The last summary section is the summary of each question asked as per the Conversation Guide. Can you refer to the guide and then the transcript and give me 200 words for each for the answers relating to each section of the guide. Please produce the document under a heading: "Interview Summary". please produce the summary in markdown format with no indents.`,
    prompt: prompt,
  });

  return text;
}
