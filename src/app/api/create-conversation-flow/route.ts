import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { prompt, projectId } = body;

  const finalPrompt = `I am interviewing customers and potential customers and I want help creating a conversation flow for a 45 min interview. 
${prompt}.  I have a conversation guide flow that I want you to follow but please tailor to my business, my business issue and my hypotheses.   These are the 8 question sections I want you to follow:
Question 1: Tell me about your work/life [say work if my business market is B2B or say life if my business is in the B2C market] at the moment?  What is good?  What is not so good?  What would you love to changed?  Please add three more prompting questions for more information.
Question 2:  Now let’s talk about the category my business operates in. What is your relationship with that category?   Can you list your painpoints and frustrations with this category?  Please add three more prompting questions for more information. 
Question 3: What brands do you use in this category?  Which ones do you like? Which one do you use the most?  Which ones do you not like?  What are the most important things to them in choosing a product in this category?  What attributes are necessary for a product to succeed or fail in the market?  Please add three more prompting questions for more information.
Question 4:   I would like to talk about our brand.  What do you think about our brand?  Likes, dislikes?  Does it solve your painpoints in the category?  How would you make it better?  Please add three more prompting questions for more information.
Question 5: Turning to my hypotheses.  Can you tell me if you agree or disagree.  What would you suggest is a better solution?  (Please write at least three prompt questions about each hypothesis.)
Each question must have some depth, give some context to the question and be more than simple bullet points.  Thank you!
`;

  let businessDetails = "";
  let market = "";
  
  try {
    if (!db) {
      throw new Error("Database not available");
    } else {

      const project = await db.project.findFirst({ where: { id: projectId } });
      const userProfile = await db.user.findFirst({ where: { id: project!.userId } });
      businessDetails = userProfile?.businessDetails ?? "";
      market = userProfile?.marketChannel ?? "";
      console.log("Market Channel: ", market);
    }
  } catch (error) {
    console.error(error);
    businessDetails = "";
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are a brand consultant interviewing people who have interacted with your client, a business. You need to generate a lead question about the interviewee's interest with the category that the business that is being discussed exists in.  The details of the business are: ${businessDetails}. The business operates in the ${market} market. Some probing questions should be generated to follow up from the leading questions. Each prompt should be treated as independent and the questions should be relevant to their business issue only.  When answering please don't provide any precursor response, just list out the questions underneath the overall heading for the documention of 'Converstation Guide'.  `,
      prompt: finalPrompt,
    });

    return new NextResponse(
      JSON.stringify({ success: "Project summarised correctly", text }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
      return new NextResponse(
        
      JSON.stringify({
        error: "An error occurred while creating the conversation flow",
      }),
      { status: 500 }
    );
  }
}
