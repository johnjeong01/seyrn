// Paddle subscription webhook handler
// Handles: subscription.created, subscription.canceled, subscription.updated

import { NextRequest, NextResponse } from "next/server";
import { EventName } from "@paddle/paddle-node-sdk";
import { getPaddle } from "@/lib/paddle";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody   = await req.text();
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
      console.error("Paddle subscription webhook signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("Paddle subscription event:", event.eventType);

    const data       = event.data as unknown as Record<string, unknown>;
    const customData = (data.customData ?? {}) as Record<string, string>;
    const subId      = (data.id as string) ?? null;
    const status     = (data.status as string) ?? null;
    const customerObj = data.customer as Record<string, string> | null | undefined;
    const email       = customerObj?.email ?? customData.email ?? null;

    if (!email) {
      console.error("Paddle subscription webhook: no email in payload");
      return NextResponse.json({ received: true });
    }

    const db = getSupabaseAdmin();

    if (event.eventType === EventName.SubscriptionCreated) {
      await db.from("subscriptions").upsert({
        email,
        paddle_subscription_id: subId,
        status:                 "active",
        plan:                   "monthly",
        current_period_start:   new Date().toISOString(),
      }, { onConflict: "email" });

      await db
        .from("reports")
        .update({ is_paid: true, plan: "monthly" })
        .eq("email", email);

      console.log("Paddle subscription created:", email);
      return NextResponse.json({ received: true });
    }

    if (event.eventType === EventName.SubscriptionCanceled) {
      await db
        .from("subscriptions")
        .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
        .eq("paddle_subscription_id", subId);

      console.log("Paddle subscription cancelled:", email);
      return NextResponse.json({ received: true });
    }

    if (event.eventType === EventName.SubscriptionUpdated) {
      await db
        .from("subscriptions")
        .update({ status: status ?? "active" })
        .eq("paddle_subscription_id", subId);

      console.log("Paddle subscription updated:", email, "status:", status);
      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Subscription webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
