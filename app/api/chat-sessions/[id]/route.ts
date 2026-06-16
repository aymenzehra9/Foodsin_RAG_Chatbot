import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { jsonError } from "@/lib/utils/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: session, error } = await supabase.from("chat_sessions").select("*").eq("id", id).single();
  if (error) return jsonError(error.message, 404);
  const { data: messages } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", id)
    .order("created_at", { ascending: true });
  return NextResponse.json({ session, messages: messages ?? [] });
}
