import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendWaitlistConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, source } = (await req.json()) as { email?: string; firstName?: string; source?: string };

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already registered
    const { data: existing } = await getSupabaseAdmin()
      .from("waitlist")
      .select("email")
      .eq("email", normalizedEmail)
      .maybeSingle();

    const { error } = await getSupabaseAdmin().from("waitlist").upsert(
      {
        email: normalizedEmail,
        first_name: firstName?.trim() || null,
        source: source ?? null,
      },
      { onConflict: "email" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send confirmation email only on first registration
    if (!existing) {
      sendWaitlistConfirmationEmail({ to: normalizedEmail, firstName: firstName ?? null })
        .catch(() => { /* silent — DB record is saved regardless */ });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
