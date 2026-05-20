import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getPaddle } from "@/lib/paddle";

export const dynamic = "force-dynamic";

function signReportId(reportId: string): string {
  const secret = process.env.PADDLE_WEBHOOK_SECRET ?? "";
  return crypto.createHmac("sha256", secret).update(reportId).digest("hex").slice(0, 40);
}

export async function POST(req: NextRequest) {
  try {
    const { reportId, email, firstName } = (await req.json()) as {
      reportId: string;
      email?: string;
      firstName?: string;
    };

    if (!reportId) {
      return NextResponse.json({ error: "reportId is required" }, { status: 400 });
    }

    const paddle   = getPaddle();
    const appUrl   = process.env.NEXT_PUBLIC_APP_URL ?? "https://seyrn.app";
    const sig      = signReportId(reportId);
    const successUrl = `${appUrl}/report?reportId=${reportId}&paid=true&sig=${sig}`;

    const transaction = await paddle.transactions.create({
      items: [{ priceId: process.env.PADDLE_PRICE_ID_ONETIME! as string, quantity: 1 }],
      customData: {
        report_id:  reportId,
        first_name: firstName ?? "",
        email:      email ?? "",
      },
      checkout: { url: successUrl },
    });

    const checkoutUrl = transaction.checkout?.url;
    if (!checkoutUrl) {
      throw new Error("No checkout URL returned from Paddle");
    }

    // Pre-fill customer email if provided
    const finalUrl = email
      ? `${checkoutUrl}?prefilled_email=${encodeURIComponent(email)}`
      : checkoutUrl;

    return NextResponse.json({ checkoutUrl: finalUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
