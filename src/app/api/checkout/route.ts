import { NextRequest, NextResponse } from "next/server";
import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export const dynamic = "force-dynamic";

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

    lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://seyrn.app";

    const response = await createCheckout(
      process.env.LEMONSQUEEZY_STORE_ID!,
      process.env.LEMONSQUEEZY_PRODUCT_ID_ONETIME!,
      {
        checkoutData: {
          email: email ?? undefined,
          name: firstName ?? undefined,
          custom: {
            report_id: reportId,
            first_name: firstName ?? "",
          },
        },
        checkoutOptions: {
          embed: false,
          media: false,
          logo: true,
        },
        productOptions: {
          name: "Seyrn Full Report",
          description: "Your complete life pattern analysis",
          redirectUrl: `${appUrl}/report?reportId=${reportId}&paid=true`,
          receiptButtonText: "View Your Report",
          receiptThankYouNote: firstName
            ? `${firstName}, your pattern analysis is ready.`
            : "Your pattern analysis is ready.",
          enabledVariants: [],
        },
      }
    );

    const url = response.data?.data.attributes.url;
    if (!url) {
      throw new Error("No checkout URL returned");
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
