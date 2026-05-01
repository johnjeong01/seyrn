import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendReportReadyEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature");

    if (!signature || !process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 401 });
    }

    const hmac = crypto.createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
    const digest = hmac.update(rawBody).digest("hex");

    if (signature !== digest) {
      console.error("Webhook signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody) as {
      meta: {
        event_name: string;
        custom_data?: { report_id?: string; first_name?: string };
      };
      data: {
        id: string;
        attributes: { user_email?: string; status?: string };
      };
    };

    const eventName = payload.meta.event_name;
    console.log("LS webhook event:", eventName);

    // Only handle successful orders
    if (eventName !== "order_created") {
      return NextResponse.json({ received: true });
    }

    const reportId = payload.meta.custom_data?.report_id;
    const email = payload.data.attributes.user_email ?? null;
    const firstName = payload.meta.custom_data?.first_name ?? null;
    const paymentId = payload.data.id;

    if (!reportId) {
      console.error("No report_id in webhook custom_data");
      return NextResponse.json({ received: true });
    }

    const db = getSupabaseAdmin();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://seyrn.app";

    // Mark report as paid
    const { error: updateErr } = await db
      .from("reports")
      .update({
        is_paid: true,
        payment_id: paymentId,
        email: email ?? undefined,
        first_name: firstName ?? undefined,
        email_sent_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    if (updateErr) {
      console.error("DB update failed:", updateErr.message);
    } else {
      console.log("Report marked paid:", reportId);
    }

    // Send report-ready email
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
