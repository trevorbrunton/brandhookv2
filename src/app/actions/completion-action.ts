"use server"
import { db } from "@/db"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const keyQuestions = [
  "Introduction: Ask about the interviewee's life or work.",
  "Category Exploration: Discuss the business category and pain points.",
  "Brand Usage: Explore brands used in the category.",
  "Client's Brand: Discuss perceptions of the client's brand.",
  "Hypothesis Testing: Address each hypothesis individually.",
]

export async function generateConversation(prompt: string, projectId: string) {
  const finalPrompt = `
I'm creating a 45-minute interview guide for customers and potential customers. 
${prompt}
Please follow this conversation guide structure, tailoring it to my business, issue, and hypotheses:

${keyQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

For each section:
- Provide context and depth to the questions.
- Include at least three follow-up questions to probe for more information.
- Ensure questions are relevant to the business issue and hypotheses.

Please format the output as a structured "Conversation Guide" with clear headings and subheadings.
`

  let businessDetails = ""
  try {
    if (!db) throw new Error("Database not available")

    const projects = db.collection("projects")
    const users = db.collection("userProfiles")
    const project = await projects.findOne({ projectId })
    if (!project) throw new Error("Project not found")

    const userProfile = await users.findOne({ email: project.userEmail })
    if (!userProfile) throw new Error("User profile not found")

    businessDetails = userProfile.businessDetails
  } catch (e) {
    console.error("Error fetching business details:", e)
  }

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: `You are a brand consultant creating an interview guide. The business details are: ${businessDetails}. Focus on generating relevant, probing questions that address the business issue and hypotheses.`,
    prompt: finalPrompt,
  })

  return text
}

