import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email ?? session.metadata?.email;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

      console.log("Checkout completed:", session.id, "email:", email, "plan:", session.metadata?.plan);

      if (email && appUrl) {
        try {
          const supabase = getSupabaseAdmin();
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: `${appUrl}/report`,
              shouldCreateUser: true,
            },
          });
          if (error) {
            console.error("Magic link send failed:", error.message);
          } else {
            console.log("Magic link sent to:", email);
          }
        } catch (err) {
          // Supabase not configured — log and continue (don't fail the webhook)
          console.error("Supabase not configured:", err instanceof Error ? err.message : err);
        }
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("Subscription cancelled:", subscription.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
