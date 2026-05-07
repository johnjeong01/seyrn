// Lemon Squeezy subscription webhook handler
// Handles: subscription_created, subscription_cancelled, subscription_updated

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

interface LSSubscriptionPayload {
  meta: {
    event_name: string;
    custom_data?: { report_id?: string; email?: string };
  };
  data: {
    id:         string;
    attributes: {
      status:                 string;
      customer_id:            number;
      variant_id:             number;
      order_id:               number;
      user_email:             string;
      renews_at:              string | null;
      ends_at:                string | null;
      cancelled:              boolean;
      trial_ends_at:          string | null;
      current_period_end?:    string | null;
      billing_anchor?:        number;
    };
  };
}

function verifySignature(body: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(body);
  const expected = hmac.digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature") ?? "";
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? "";

  if (!secret || !verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: LSSubscriptionPayload;
  try {
    payload = JSON.parse(rawBody) as LSSubscriptionPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event_name, custom_data } = payload.meta;
  const attr = payload.data.attributes;
  const lsSubId = payload.data.id;
  const email = attr.user_email ?? custom_data?.email;

  if (!email) {
    console.error("LS subscription webhook: no email in payload");
    return NextResponse.json({ received: true });
  }

  const db = getSupabaseAdmin();

  if (event_name === "subscription_created") {
    const periodEnd = attr.renews_at ?? attr.ends_at ?? null;

    await db.from("subscriptions").upsert({
      email,
      ls_subscription_id:   lsSubId,
      ls_order_id:          String(attr.order_id),
      ls_customer_id:       String(attr.customer_id),
      ls_variant_id:        String(attr.variant_id),
      status:               "active",
      plan:                 "monthly",
      current_period_start: new Date().toISOString(),
      current_period_end:   periodEnd,
    }, { onConflict: "email" });

    // Mark any existing report as subscriber
    await db
      .from("reports")
      .update({ is_paid: true, plan: "monthly" })
      .eq("email", email);

    console.log(`LS subscription created: ${email}`);
    return NextResponse.json({ received: true });
  }

  if (event_name === "subscription_cancelled") {
    await db
      .from("subscriptions")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("ls_subscription_id", lsSubId);

    console.log(`LS subscription cancelled: ${email}`);
    return NextResponse.json({ received: true });
  }

  if (event_name === "subscription_updated") {
    const newStatus = attr.cancelled ? "cancelled" : attr.status as string;
    const periodEnd = attr.renews_at ?? attr.ends_at ?? null;

    await db
      .from("subscriptions")
      .update({
        status:              newStatus,
        current_period_end:  periodEnd,
        cancelled_at:        attr.cancelled ? new Date().toISOString() : null,
      })
      .eq("ls_subscription_id", lsSubId);

    console.log(`LS subscription updated: ${email}, status: ${newStatus}`);
    return NextResponse.json({ received: true });
  }

  // Unhandled event — acknowledge
  return NextResponse.json({ received: true });
}
