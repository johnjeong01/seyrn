// Cron: daily 09:00 UTC
// Sends reminder emails to active subscribers who haven't logged today
// Email sending is stubbed (console log) until Resend domain is verified

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getSupabaseAdmin();
  const today = new Date().toISOString().split("T")[0];

  // Active subscribers
  const { data: subs } = await db
    .from("subscriptions")
    .select("user_id, email")
    .eq("status", "active")
    .not("user_id", "is", null);

  const subscribers = (subs ?? []) as Array<{ user_id: string; email: string }>;

  // Find who already logged today
  const userIds = subscribers.map(s => s.user_id);
  if (!userIds.length) return NextResponse.json({ sent: 0 });

  const { data: todayEntries } = await db
    .from("daily_entries")
    .select("user_id")
    .in("user_id", userIds)
    .eq("entry_date", today);

  const loggedToday = new Set((todayEntries ?? []).map((e: { user_id: string }) => e.user_id));
  const needsReminder = subscribers.filter(s => !loggedToday.has(s.user_id));

  // TODO: send actual email via Resend once domain is verified
  // For now: log + track
  for (const sub of needsReminder) {
    console.log(`[reminder-email] Would send to ${sub.email} — today: ${today}`);
  }

  return NextResponse.json({ sent: needsReminder.length, skipped: loggedToday.size });
}
