import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { stripeSessionId, email, plan, reportData } = (await req.json()) as {
      stripeSessionId: string;
      email?: string;
      plan: string;
      reportData: unknown;
    };

    if (!stripeSessionId || !reportData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin().from("reports").upsert(
      {
        stripe_session_id: stripeSessionId,
        email: email ?? null,
        plan,
        report_data: reportData,
      },
      { onConflict: "stripe_session_id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
