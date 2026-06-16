import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

type TableName = keyof Database["public"]["Tables"];
type Parser = { parse: (value: unknown) => unknown; partial?: () => Parser };

export function tableHandlers(table: TableName, idColumn = "id") {
  return {
    async list(request: Request) {
      const supabase = await createServerSupabaseClient();
      const { searchParams } = new URL(request.url);
      const restaurantId = searchParams.get("restaurantId");
      let query = supabase.from(table).select("*").order("created_at", { ascending: false });
      if (restaurantId) query = query.eq("restaurant_id", restaurantId);
      const { data, error } = await query;
      if (error) return jsonError(error.message, 500);
      return NextResponse.json(data);
    },
    async create(request: Request, parser: Parser) {
      const supabase = await createServerSupabaseClient();
      const payload = parser.parse(await request.json());
      const { data, error } = await supabase.from(table).insert(payload as never).select("*").single();
      if (error) return jsonError(error.message, 500);
      return NextResponse.json(data, { status: 201 });
    },
    async update(request: Request, id: string, parser: Parser) {
      const supabase = await createServerSupabaseClient();
      const payload = (parser.partial?.() ?? parser).parse(await request.json());
      const { data, error } = await supabase.from(table).update(payload as never).eq(idColumn, id).select("*").single();
      if (error) return jsonError(error.message, 500);
      return NextResponse.json(data);
    },
    async remove(_: Request, id: string) {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from(table).delete().eq(idColumn, id);
      if (error) return jsonError(error.message, 500);
      return NextResponse.json({ ok: true });
    }
  };
}
