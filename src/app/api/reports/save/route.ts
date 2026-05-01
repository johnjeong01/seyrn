import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, plan, reportData } = (await req.json()) as {
      email?: string;
      firstName?: string;
      plan?: string;
      reportData: unknown;
    };

    if (!reportData) {
      return NextResponse.json({ error: "Missing reportData" }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("reports")
      .insert({
        email: email ?? null,
        first_name: firstName ?? null,
        plan: plan ?? "one-time",
        report_data: reportData,
        is_paid: false,
      })
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
