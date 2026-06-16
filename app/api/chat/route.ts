import { NextResponse } from "next/server";
import { generateRagAnswer, retrieveRelevantChunks } from "@/lib/ai/rag";
import { createAdminClient } from "@/lib/supabase/admin";
import { FALLBACK_MESSAGE } from "@/lib/utils/constants";
import { jsonError } from "@/lib/utils/api";
import { chatSchema } from "@/lib/utils/validators";
import type { KnowledgeChunk } from "@/types/database";

function buildSources(chunks: KnowledgeChunk[]) {
  return chunks.map((chunk) => ({
    documentId: chunk.document_id,
    content: chunk.content.slice(0, 300),
    similarity: chunk.similarity ?? null
  }));
}

function buildContextFallback(chunks: KnowledgeChunk[], phone?: string | null) {
  const snippets = chunks
    .slice(0, 2)
    .map((chunk) => chunk.content.split("\n").filter(Boolean).slice(0, 5).join(" "))
    .join(" ");

  return [
    "I found relevant Foods Inn knowledge, but the AI response service is currently rate-limited.",
    snippets ? `Relevant information: ${snippets.slice(0, 700)}` : "",
    phone ? `For confirmation, please contact Foods Inn at ${phone}.` : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function isModelIdentityQuestion(message: string) {
  return /\b(llm|language model|ai model|chatbot model|model name|which model|what model)\b/i.test(message);
}

function buildModelIdentityAnswer(chunks: KnowledgeChunk[]) {
  const hasModelInfo = chunks.some((chunk) => chunk.content.toLowerCase().includes("gemini-2.0-flash"));
  if (!hasModelInfo) return null;

  return "This chatbot uses Google's Gemini AI models. Chat model: gemini-2.0-flash. Embedding model: gemini-embedding-001.";
}

export async function POST(request: Request) {
  const payload = chatSchema.parse(await request.json());
  const supabase = createAdminClient();

  const { data: restaurant } = await supabase.from("restaurants").select("id, phone").eq("id", payload.restaurantId).single();
  if (!restaurant) return jsonError("Restaurant not found", 404);

  const { data: settings } = await supabase
    .from("chatbot_settings")
    .select("is_active, fallback_message")
    .eq("restaurant_id", payload.restaurantId)
    .maybeSingle();

  if (settings && settings.is_active === false) {
    return jsonError("Chatbot is currently inactive", 403);
  }

  let sessionId = payload.sessionId;
  if (!sessionId) {
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .insert({ restaurant_id: payload.restaurantId })
      .select("id")
      .single();
    if (sessionError) return jsonError(sessionError.message, 500);
    sessionId = session.id as string;
  }

  await supabase.from("chat_messages").insert({
    restaurant_id: payload.restaurantId,
    session_id: sessionId,
    role: "user",
    content: payload.message
  });

  let chunks: KnowledgeChunk[] = [];
  try {
    chunks = await retrieveRelevantChunks(payload.restaurantId, payload.message);
  } catch (error) {
    console.error("RAG retrieval failed", error);
    const answer = `${FALLBACK_MESSAGE} ${restaurant.phone ? `You can call ${restaurant.phone}.` : ""}`.trim();
    await supabase.from("chat_messages").insert({
      restaurant_id: payload.restaurantId,
      session_id: sessionId,
      role: "assistant",
      content: answer,
      sources: []
    });
    return NextResponse.json({ sessionId, answer, sources: [], error: "retrieval_failed" });
  }

  const sources = buildSources(chunks);
  let answer = chunks.length > 0 ? "" : (settings?.fallback_message as string) || FALLBACK_MESSAGE;

  if (chunks.length > 0) {
    answer = isModelIdentityQuestion(payload.message) ? buildModelIdentityAnswer(chunks) ?? "" : "";

    if (!answer) {
      try {
        answer = await generateRagAnswer({ question: payload.message, chunks });
      } catch (error) {
        console.error("RAG answer generation failed", error);
        answer = buildContextFallback(chunks, restaurant.phone as string | null);
      }
    }
  }

  await supabase.from("chat_messages").insert({
    restaurant_id: payload.restaurantId,
    session_id: sessionId,
    role: "assistant",
    content: answer,
    sources
  });

  return NextResponse.json({ sessionId, answer, sources });
}
