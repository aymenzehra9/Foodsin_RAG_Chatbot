import { createAdminClient } from "@/lib/supabase/admin";
import { FALLBACK_MESSAGE } from "@/lib/utils/constants";
import type { KnowledgeChunk } from "@/types/database";
import { generateEmbedding } from "./embeddings";
import { generateGeminiText } from "./gemini";
import { buildRagUserPrompt, buildRestaurantSystemPrompt } from "./prompts";

export async function retrieveRelevantChunks(restaurantId: string, query: string) {
  const supabase = createAdminClient();
  const embedding = await generateEmbedding(query);
  const { data, error } = await supabase.rpc("match_knowledge_chunks", {
    query_embedding: embedding,
    match_restaurant_id: restaurantId,
    match_count: 5,
    similarity_threshold: 0.5
  });

  if (error) throw error;
  return (data ?? []) as KnowledgeChunk[];
}

export async function generateRagAnswer(params: { question: string; chunks: KnowledgeChunk[] }) {
  if (params.chunks.length === 0) {
    return FALLBACK_MESSAGE;
  }

  const context = params.chunks.map((chunk, index) => `[Source ${index + 1}]\n${chunk.content}`).join("\n\n");
  const answer = await generateGeminiText({
    systemPrompt: buildRestaurantSystemPrompt(),
    userPrompt: buildRagUserPrompt(context, params.question)
  });

  return answer || FALLBACK_MESSAGE;
}
