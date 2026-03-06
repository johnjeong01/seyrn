import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    const plan = (session.metadata?.plan ?? "one-time") as "one-time" | "monthly";
    const customerId = typeof session.customer === "string" ? session.customer : null;

    let paid = false;
    if (plan === "monthly") {
      paid = session.status === "complete";
    } else {
      paid = session.payment_status === "paid";
    }

    return NextResponse.json({ paid, plan, customerId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
