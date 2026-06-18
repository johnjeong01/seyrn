import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { type Paddle } from "@paddle/paddle-node-sdk";
import { getPaddle } from "@/lib/paddle";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

function signReportId(reportId: string): string {
  const secret = process.env.PADDLE_WEBHOOK_SECRET ?? "";
  return crypto.createHmac("sha256", secret).update(reportId).digest("hex").slice(0, 40);
}

async function getDiscountId(paddle: Paddle, code: string): Promise<string | null> {
  try {
    const collection = paddle.discounts.list({ code: [code] });
    const results    = await collection.next();
    return results[0]?.id ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { reportId, email, firstName, discountCode } = (await req.json()) as {
      reportId: string;
      email?: string;
      firstName?: string;
      discountCode?: string;
    };

    if (!reportId) {
      return NextResponse.json({ error: "reportId is required" }, { status: 400 });
    }

    // Promo duplicate check — before creating any Paddle transaction
    if (discountCode && email) {
      const db = getSupabaseAdmin();
      const { data: existing } = await db
        .from("promo_redemptions")
        .select("id")
        .eq("email", email)
        .eq("promo_code", discountCode)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ error: "already_redeemed" }, { status: 409 });
      }
    }

    const paddle     = getPaddle();
    const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? "https://seyrn.app";
    const sig        = signReportId(reportId);
    const successUrl = `${appUrl}/report?reportId=${reportId}&paid=true&sig=${sig}`;

    // Look up discount ID if a code was provided
    let discountId: string | null = null;
    if (discountCode) {
      discountId = await getDiscountId(paddle, discountCode);
    }

    const transaction = await paddle.transactions.create({
      items:      [{ priceId: process.env.PADDLE_PRICE_ID_ONETIME! as string, quantity: 1 }],
      discountId: discountId ?? undefined,
      customData: {
        report_id:  reportId,
        first_name: firstName ?? "",
        email:      email ?? "",
        promo_code: discountCode ?? "",
      },
      checkout: { url: successUrl },
    });

    if (!transaction.id) {
      throw new Error("No transaction ID returned from Paddle");
    }

    return NextResponse.json({ transactionId: transaction.id, successUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
