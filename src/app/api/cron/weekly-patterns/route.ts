// Cron: every Sunday 22:00 UTC
// Detects recurring patterns for all active subscribers

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { updateWeeklyPatterns } from "@/lib/profile-manager";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getSupabaseAdmin();

  // Get profiles for active subscribers only
  const { data: profiles, error } = await db
    .from("pattern_profiles")
    .select("id, user_id")
    .not("user_id", "is", null);

  if (error) {
    console.error("weekly-patterns cron: fetch failed", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (profiles ?? []) as Array<{ id: string; user_id: string }>;

  // Filter to active subscribers
  const { data: subs } = await db
    .from("subscriptions")
    .select("user_id")
    .eq("status", "active");

  const activeUserIds = new Set((subs ?? []).map((s: { user_id: string | null }) => s.user_id).filter(Boolean));
  const eligible = rows.filter(p => activeUserIds.has(p.user_id));

  let succeeded = 0;
  let failed = 0;

  for (const profile of eligible) {
    try {
      await updateWeeklyPatterns(profile.id);
      succeeded++;
    } catch (err) {
      failed++;
      console.error(`weekly-patterns: profile ${profile.id} failed`, err);
    }
  }

  console.log(`weekly-patterns cron: ${succeeded} succeeded, ${failed} failed`);
  return NextResponse.json({ succeeded, failed });
}
