import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reportId = searchParams.get("reportId");

  if (!reportId) {
    return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("reports")
      .select("is_paid, plan")
      .eq("id", reportId)
      .single();

    if (error || !data) {
      return NextResponse.json({ paid: false });
    }

    return NextResponse.json({
      paid: data.is_paid,
      plan: data.plan ?? "one-time",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
