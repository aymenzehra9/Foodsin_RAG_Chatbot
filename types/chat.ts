import type { KnowledgeChunk } from "./database";

export type ChatRequest = {
  restaurantId: string;
  sessionId?: string | null;
  message: string;
};

export type ChatResponse = {
  sessionId: string;
  answer: string;
  sources: Pick<KnowledgeChunk, "document_id" | "content" | "similarity">[];
};
