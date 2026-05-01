import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendD3Email, sendD7Email, sendD30Email } from "@/lib/email";

export const runtime = "nodejs";
export const maxDuration = 60;

// Vercel Cron calls this at 9am UTC daily (configured in vercel.json)
// Secured by CRON_SECRET header
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://seyrn.app";
  const db = getSupabaseAdmin();
  const now = new Date();
  let sent = 0;
  const errors: string[] = [];

  // Fetch reports that have an email, were paid (email_sent_at set), and need follow-ups
  const { data: reports, error: fetchErr } = await db
    .from("reports")
    .select("id, email, first_name, report_data, email_sent_at, d3_email_sent, d7_email_sent, d30_email_sent")
    .not("email_sent_at", "is", null)
    .not("email", "is", null);

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }

  for (const row of reports ?? []) {
    const email: string = row.email;
    const firstName: string | null = row.first_name ?? null;
    const sentAt = new Date(row.email_sent_at as string);
    const daysSince = (now.getTime() - sentAt.getTime()) / (1000 * 60 * 60 * 24);
    const reportUrl = `${appUrl}/report?reportId=${row.id}&paid=true`;

    // Extract next turning point summary for D+7
    let tpSummary: string | null = null;
    try {
      const rd = row.report_data as { sections?: { next_turning_point?: { trigger?: string; headline?: string } } };
      tpSummary = rd?.sections?.next_turning_point?.trigger
        ?? rd?.sections?.next_turning_point?.headline
        ?? null;
    } catch { /* ignore */ }

    try {
      // D+3
      if (!row.d3_email_sent && daysSince >= 3) {
        await sendD3Email({ to: email, firstName, reportUrl });
        await db.from("reports").update({ d3_email_sent: true }).eq("id", row.id);
        sent++;
      }
      // D+7
      else if (!row.d7_email_sent && daysSince >= 7) {
        await sendD7Email({ to: email, firstName, reportUrl, nextTurningPointSummary: tpSummary });
        await db.from("reports").update({ d7_email_sent: true }).eq("id", row.id);
        sent++;
      }
      // D+30
      else if (!row.d30_email_sent && daysSince >= 30) {
        await sendD30Email({ to: email, firstName });
        await db.from("reports").update({ d30_email_sent: true }).eq("id", row.id);
        sent++;
      }
    } catch (err) {
      errors.push(`${email}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return NextResponse.json({ ok: true, sent, errors: errors.length ? errors : undefined });
}
