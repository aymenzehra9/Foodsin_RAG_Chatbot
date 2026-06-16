import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { jsonError } from "@/lib/utils/api";

export async function POST(request: Request) {
  const { restaurantId } = await request.json();
  if (!restaurantId) return jsonError("restaurantId is required");

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("knowledge_documents")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .in("source_type", ["manual", "profile", "menu", "faq", "deal"]);

  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ queuedDocumentIds: data?.map((document) => document.id) ?? [] });
}
