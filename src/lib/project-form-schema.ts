import { z } from "zod";

export const ProjectDetailsFormSchema = z.object({
  projectName: z
    .string()
    .min(2, { message: "Please enter a name for your project" }),
  projectDetails: z
    .string()
    .min(2, { message: "Please enter some details for your project" }),
});
