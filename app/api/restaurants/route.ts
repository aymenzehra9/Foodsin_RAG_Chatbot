import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { jsonError } from "@/lib/utils/api";
import { DEFAULT_TAX_NOTE } from "@/lib/utils/constants";
import { restaurantSchema } from "@/lib/utils/validators";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("restaurants").select("*").order("created_at", { ascending: false });
  if (error) return jsonError(error.message, 500);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return jsonError("Unauthorized", 401);
  const payload = restaurantSchema.parse(await request.json());
  const { data, error } = await supabase
    .from("restaurants")
    .insert({ ...payload, owner_id: userData.user.id, tax_note: payload.tax_note || DEFAULT_TAX_NOTE })
    .select("*")
    .single();
  if (error) return jsonError(error.message, 500);
  return NextResponse.json(data, { status: 201 });
}
