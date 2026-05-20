import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function signReportId(reportId: string): string {
  const secret = process.env.PADDLE_WEBHOOK_SECRET ?? "";
  return crypto.createHmac("sha256", secret).update(reportId).digest("hex").slice(0, 40);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reportId = searchParams.get("reportId");
  const sig      = searchParams.get("sig");

  if (!reportId) {
    return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
  }

  // Signature path: checkout embeds HMAC in successUrl — verify immediately
  // without waiting for webhook. Signature is not guessable without the server secret.
  if (sig) {
    try {
      const expected = signReportId(reportId);
      const sigBuf   = Buffer.from(sig.padEnd(expected.length, " "));
      const expBuf   = Buffer.from(expected);
      const valid    = sigBuf.length === expBuf.length &&
                       crypto.timingSafeEqual(sigBuf, expBuf);

      if (valid) {
        // Mark paid in DB in the background (don't block the response)
        void Promise.resolve(
          getSupabaseAdmin()
            .from("reports")
            .update({ is_paid: true })
            .eq("id", reportId)
        ).catch(() => {});

        return NextResponse.json({ paid: true, plan: "one-time", source: "sig" });
      }
    } catch { /* fall through to DB check */ }
  }

  // DB path: webhook has already fired and set is_paid = true
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("reports")
      .select("is_paid, plan")
      .eq("id", reportId)
      .maybeSingle();

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
