import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { generateDailyInsight } from "@/lib/ai-calls";
import { updateDailyContext } from "@/lib/profile-manager";
import type { DailyEntry, AIContext } from "@/lib/pattern-profile";

export const maxDuration = 30;

interface DailyEntryBody {
  energy_score: number;
  mood:         "thriving" | "steady" | "struggling" | "drained";
  focus_area?:  string;
  note?:        string;
}

export async function POST(req: NextRequest) {
  // Auth
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getSupabaseAdmin();
  const { data: { user }, error: authErr } = await db.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: DailyEntryBody;
  try {
    body = await req.json() as DailyEntryBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { energy_score, mood, focus_area, note } = body;

  if (!energy_score || energy_score < 1 || energy_score > 10) {
    return NextResponse.json({ error: "energy_score must be 1–10" }, { status: 400 });
  }
  const validMoods = ["thriving", "steady", "struggling", "drained"];
  if (!validMoods.includes(mood)) {
    return NextResponse.json({ error: "Invalid mood" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];

  // Check for existing entry today (idempotent upsert)
  const { data: existing } = await db
    .from("daily_entries")
    .select("id, daily_insight")
    .eq("user_id", user.id)
    .eq("entry_date", today)
    .maybeSingle();

  if (existing?.daily_insight) {
    // Already generated — return cached
    return NextResponse.json({ insight: existing.daily_insight, cached: true });
  }

  // Upsert entry (note capped at 300 chars)
  const { error: upsertErr } = await db
    .from("daily_entries")
    .upsert({
      user_id:      user.id,
      entry_date:   today,
      energy_score,
      mood,
      focus_area:   focus_area ?? null,
      note:         note ? note.slice(0, 300) : null,
    }, { onConflict: "user_id,entry_date" });

  if (upsertErr) return NextResponse.json({ error: upsertErr.message }, { status: 500 });

  // Fetch profile
  const { data: profile } = await db
    .from("pattern_profiles")
    .select("id, first_name, baseline_energy_cycle, baseline_growth_pattern, baseline_risk_pattern, current_season, streak_days, recurring_patterns, active_alerts")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ insight: null, error: "No profile found" }, { status: 404 });
  }

  // Fetch recent 6 days (not today)
  const { data: recentRaw } = await db
    .from("daily_entries")
    .select("entry_date, energy_score, mood")
    .eq("user_id", user.id)
    .neq("entry_date", today)
    .order("entry_date", { ascending: false })
    .limit(6);

  type ProfileRow = {
    id: string;
    first_name: string | null;
    baseline_energy_cycle: string;
    baseline_growth_pattern: string;
    baseline_risk_pattern: string;
    current_season: string;
    streak_days: number;
    recurring_patterns: Array<{ title: string; description: string; confidence: number }>;
    active_alerts: Array<{ type: string; message: string }>;
  };
  const p = profile as ProfileRow;

  const context: AIContext = {
    first_name:              p.first_name ?? "you",
    baseline_energy_cycle:   p.baseline_energy_cycle,
    baseline_growth_pattern: p.baseline_growth_pattern,
    baseline_risk_pattern:   p.baseline_risk_pattern,
    current_season:          p.current_season,
    streak_days:             p.streak_days,
    top_patterns:            p.recurring_patterns.slice(0, 3),
    active_alerts:           (p.active_alerts.slice(0, 5) as AIContext["active_alerts"]),
  };

  let insight = "";
  try {
    insight = await generateDailyInsight({
      context,
      entry:      { entry_date: today, energy_score, mood, focus_area: focus_area ?? null, note: note ?? null },
      recentDays: (recentRaw ?? []) as Array<Pick<DailyEntry, "entry_date" | "energy_score" | "mood">>,
    });
  } catch {
    insight = "Pattern analysis unavailable — your entry has been saved.";
  }

  // Cache insight
  await db
    .from("daily_entries")
    .update({ daily_insight: insight })
    .eq("user_id", user.id)
    .eq("entry_date", today);

  // Update profile context (streak, alerts, milestones) — fire and forget
  updateDailyContext({
    profileId:   p.id,
    userId:      user.id,
    entryDate:   today,
    energyScore: energy_score,
  }).catch(() => { /* non-blocking */ });

  return NextResponse.json({ insight, cached: false });
}
