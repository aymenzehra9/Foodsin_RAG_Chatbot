import { generateGeminiEmbedding } from "./gemini";

export async function generateEmbedding(text: string, taskType: "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT" = "RETRIEVAL_QUERY"): Promise<number[]> {
  return generateGeminiEmbedding(text.replace(/\s+/g, " ").trim(), taskType);
}
