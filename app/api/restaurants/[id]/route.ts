import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { jsonError } from "@/lib/utils/api";
import { restaurantSchema } from "@/lib/utils/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("restaurants").select("*").eq("id", id).single();
  if (error) return jsonError(error.message, 404);
  return NextResponse.json(data);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const payload = restaurantSchema.partial().parse(await request.json());
  const { data, error } = await supabase.from("restaurants").update(payload as never).eq("id", id).select("*").single();
  if (error) return jsonError(error.message, 500);
  return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("restaurants").delete().eq("id", id);
  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ ok: true });
}
