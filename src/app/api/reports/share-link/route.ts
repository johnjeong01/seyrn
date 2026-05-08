import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

function genToken(len = 8): string {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => CHARS[b % CHARS.length]).join("");
}

export async function POST(req: NextRequest) {
  try {
    const { reportId } = (await req.json()) as { reportId?: string };
    if (!reportId) return NextResponse.json({ error: "reportId required" }, { status: 400 });

    const db = getSupabaseAdmin();

    const { data: row, error: fetchErr } = await db
      .from("reports")
      .select("share_token, is_paid")
      .eq("id", reportId)
      .maybeSingle();

    if (fetchErr || !row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!row.is_paid) return NextResponse.json({ error: "Not unlocked" }, { status: 403 });
    if (row.share_token) return NextResponse.json({ shareToken: row.share_token });

    // Generate unique token, retry on collision
    for (let i = 0; i < 5; i++) {
      const token = genToken();
      const { error } = await db
        .from("reports")
        .update({ share_token: token })
        .eq("id", reportId);
      if (!error) return NextResponse.json({ shareToken: token });
    }

    return NextResponse.json({ error: "Token generation failed" }, { status: 500 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 });
  }
}
