import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { id, email, firstName, plan, reportData } = (await req.json()) as {
      id?: string;
      email?: string;
      firstName?: string;
      plan?: string;
      reportData: unknown;
    };

    if (!reportData) {
      return NextResponse.json({ error: "Missing reportData" }, { status: 400 });
    }

    const row: Record<string, unknown> = {
      email:       email ?? null,
      first_name:  firstName ?? null,
      plan:        plan ?? "one-time",
      report_data: reportData,
      is_paid:     false,
    };
    if (id) row.id = id;

    const { data, error } = await getSupabaseAdmin()
      .from("reports")
      .insert(row)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, reportId: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
