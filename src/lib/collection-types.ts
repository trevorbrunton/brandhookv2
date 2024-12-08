import { z } from "zod";


const MemorySchema = z.object({
  documentId: z.string(),
  userId: z.string(),
  title: z.string(),
  content: z.string().optional(),
  fileUrl: z.string().optional(),
  docType: z.string(),
  collectionId: z.string(),
  createDate: z.string(),
  updateDate: z.string(),
});
export type Memory = z.infer<typeof MemorySchema>;  

export const CollectionSchema = z.object({
  collectionId: z.string(),
  userId: z.string(),
  userEmail: z.string().email(),
  collectionName: z.string(),
  collectionDetails: z.string(),
  memories: z.array(MemorySchema),

  createDate: z.string(),
  updateDate: z.string(),
});

// TypeScript type inferred from the schema
export type Collection = z.infer<typeof CollectionSchema>;


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
