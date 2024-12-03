import { z } from "zod";

// Assuming you have a ProjectDocumentSchema defined elsewhere
const ProjectDocumentSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  content: z.string().optional(),
  fileUrl: z.string().optional(),
  docType: z.string(),
  projectId: z.string(),
  createDate: z.string(),
  updateDate: z.string(),
});
export type ProjectDocument = z.infer<typeof ProjectDocumentSchema>;  

export const ProjectSchema = z.object({
  projectId: z.string(),
  userEmail: z.string().email(),
  projectName: z.string(),
  projectDetails: z.string(),
  projectDocuments: z.array(ProjectDocumentSchema),
  objectives: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, { message: "Please enter a description of this objective" }),
      })
    )
    .optional(),
  rValues: z.array(z.string()),
  projectStage: z.number(),
  createDate: z.string(),
  updateDate: z.string(),
});

// TypeScript type inferred from the schema
export type Project = z.infer<typeof ProjectSchema>;


export type NodeData = {
  name: string;
  description: string;
  comments: string;
  color: string;
};

export type ProcessNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
};

export type ProcessEdge = {
  id: string;
  source: { nodeId: string; handleId: string };
  target: { nodeId: string; handleId: string };
};

export type ProcessNodeCollection = {
  nodes: ProcessNode[];
};

export type ProcessEdgeCollection = { edges: ProcessEdge[] };
