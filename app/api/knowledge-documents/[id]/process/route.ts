import { NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { createAdminClient } from "@/lib/supabase/admin";
import { jsonError } from "@/lib/utils/api";
import { chunkText } from "@/lib/utils/chunk-text";

type Params = { params: Promise<{ id: string }> };

export async function POST(_: Request, { params }: Params) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: document, error } = await supabase.from("knowledge_documents").select("*").eq("id", id).single();
  if (error || !document) return jsonError("Knowledge document not found", 404);

  await supabase.from("knowledge_documents").update({ status: "processing" } as never).eq("id", id);
  await supabase.from("knowledge_chunks").delete().eq("document_id", id);

  try {
    const chunks = chunkText(document.content ?? "");
    const rows = await Promise.all(
      chunks.map(async (content, chunk_index) => ({
        restaurant_id: document.restaurant_id,
        document_id: document.id,
        content,
        chunk_index,
        token_count: Math.ceil(content.length / 4),
        metadata: { sourceType: document.source_type, title: document.title },
        embedding: await generateEmbedding(content, "RETRIEVAL_DOCUMENT")
      }))
    );

    if (rows.length > 0) {
      const { error: insertError } = await supabase.from("knowledge_chunks").insert(rows as never);
      if (insertError) throw insertError;
    }

    await supabase.from("knowledge_documents").update({ status: "completed" } as never).eq("id", id);
    return NextResponse.json({ ok: true, chunkCount: rows.length });
  } catch (processError) {
    await supabase.from("knowledge_documents").update({ status: "failed" } as never).eq("id", id);
    return jsonError(processError instanceof Error ? processError.message : "Embedding generation failed", 500);
  }
}
