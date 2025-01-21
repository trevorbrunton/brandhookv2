import { z } from "zod";

export const ConversationFormSchema = z.object({
  conversationFlowName: z
    .string()
    .min(2, { message: "Please enter a name for your conversation flow" }),
  businessIssue: z
    .string()
    .min(2, { message: "Please enter your business issue" }),
  hypotheses: z.array(
    z.object({
      name: z
        .string()
        .min(2, { message: "Please enter a description of this hypothesis" }),
    })
  ),
});
