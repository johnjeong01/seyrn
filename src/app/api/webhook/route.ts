import { NextRequest, NextResponse } from "next/server";
import { EventName } from "@paddle/paddle-node-sdk";
import { getPaddle } from "@/lib/paddle";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendReportReadyEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody  = await req.text();
    const signature = req.headers.get("paddle-signature") ?? "";

    if (!signature || !process.env.PADDLE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 401 });
    }

    const paddle = getPaddle();

    let event;
    try {
      event = await paddle.webhooks.unmarshal(
        rawBody,
        process.env.PADDLE_WEBHOOK_SECRET,
        signature,
      );
    } catch {
      console.error("Paddle webhook signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("Paddle webhook event:", event.eventType);

    if (event.eventType !== EventName.TransactionCompleted) {
      return NextResponse.json({ received: true });
    }

    const data       = event.data as unknown as Record<string, unknown>;
    const customData = (data.customData ?? {}) as Record<string, string>;
    const reportId   = customData.report_id ?? null;
    const firstName  = customData.first_name ?? null;
    const txId       = (data.id as string) ?? null;

    // Email: prefer Paddle customer record, fall back to what we embedded in customData
    const customerObj = data.customer as Record<string, string> | null | undefined;
    const email = customerObj?.email ?? customData.email ?? null;

    if (!reportId) {
      console.error("Paddle webhook: no report_id in custom_data");
      return NextResponse.json({ received: true });
    }

    const db     = getSupabaseAdmin();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://seyrn.app";

    const { error: updateErr } = await db
      .from("reports")
      .update({
        is_paid:        true,
        payment_id:     txId,
        email:          email ?? undefined,
        first_name:     firstName ?? undefined,
        email_sent_at:  new Date().toISOString(),
      })
      .eq("id", reportId);

    if (updateErr) {
      console.error("DB update failed:", updateErr.message);
    } else {
      console.log("Report marked paid:", reportId);
    }

    if (email) {
      const reportUrl = `${appUrl}/report?reportId=${reportId}&paid=true`;
      try {
        await sendReportReadyEmail({ to: email, firstName, reportUrl });
        console.log("Report-ready email sent to:", email);
      } catch (err) {
        console.error("Email send failed:", err instanceof Error ? err.message : err);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
