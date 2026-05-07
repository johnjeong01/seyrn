// Phase 2: Profile manager — all DB reads/writes for pattern profiles
// No AI calls here except via updateWeeklyPatterns → ai-calls.ts

import { getSupabaseAdmin } from "./supabase-admin";
import type { ReportData } from "./report-types";
import type {
  PatternProfile,
  DailyEntry,
  Alert,
  AIContext,
} from "./pattern-profile";
import { updateRecurringPatterns } from "./ai-calls";

// ── createInitialProfile ───────────────────────────────────────────
// Called after report generation + successful LS payment.
// Extracts baseline from ReportData. Zero AI calls.

export async function createInitialProfile(params: {
  userId:    string | null;
  reportId:  string | null;
  email:     string | null;
  firstName: string | null;
  report:    ReportData;
  season:    string;
}): Promise<string> {
  const { userId, reportId, email, firstName, report, season } = params;
  const db = getSupabaseAdmin();

  const { data, error } = await db
    .from("pattern_profiles")
    .insert({
      user_id:                 userId,
      report_id:               reportId,
      email,
      first_name:              firstName,
      baseline_energy_cycle:   report.sections.energy_cycle.summary,
      baseline_growth_pattern: report.sections.relationship_pattern.summary,
      baseline_risk_pattern:   report.sections.risk_pattern.summary,
      current_season:          normalizeSeason(season),
      streak_days:             0,
      last_entry_date:         null,
      recurring_patterns:      [],
      active_alerts:           [],
      milestones:              [],
    })
    .select("id")
    .single();

  if (error) throw new Error(`createInitialProfile: ${error.message}`);
  return (data as { id: string }).id;
}

// ── updateDailyContext ─────────────────────────────────────────────
// Called after every daily entry. Calculates streak, detects alerts.
// Zero AI calls — fast, synchronous logic only.

export async function updateDailyContext(params: {
  profileId:    string;
  userId:       string;
  entryDate:    string;  // YYYY-MM-DD
  energyScore:  number;
}): Promise<void> {
  const { profileId, userId, entryDate, energyScore } = params;
  const db = getSupabaseAdmin();

  // Fetch current profile
  const { data: profile, error: profileErr } = await db
    .from("pattern_profiles")
    .select("streak_days, last_entry_date, active_alerts, milestones")
    .eq("id", profileId)
    .single();
  if (profileErr) throw new Error(`updateDailyContext fetch: ${profileErr.message}`);

  const p = profile as Pick<PatternProfile, "streak_days" | "last_entry_date" | "active_alerts" | "milestones">;

  // Streak calculation
  const newStreak = calculateStreak(p.last_entry_date, entryDate, p.streak_days);

  // Fetch last 7 entries for alert detection
  const { data: recent } = await db
    .from("daily_entries")
    .select("entry_date, energy_score, mood")
    .eq("user_id", userId)
    .order("entry_date", { ascending: false })
    .limit(7);

  const recentEntries = (recent ?? []) as Array<Pick<DailyEntry, "entry_date" | "energy_score" | "mood">>;
  const alerts = detectAlerts(recentEntries, energyScore, newStreak, p.streak_days);

  // Milestone tracking (max 20 kept)
  const milestones = [...(p.milestones as PatternProfile["milestones"])];
  if (energyScore >= 9) {
    milestones.push({ date: entryDate, description: "Peak energy day", energy: energyScore });
    if (milestones.length > 20) milestones.shift();
  }

  await db
    .from("pattern_profiles")
    .update({
      streak_days:     newStreak,
      last_entry_date: entryDate,
      active_alerts:   alerts,
      milestones,
    })
    .eq("id", profileId);
}

// ── detectAlerts ───────────────────────────────────────────────────
// Pure function — no DB, no AI. Returns current alert list.

export function detectAlerts(
  recentEntries: Array<Pick<DailyEntry, "entry_date" | "energy_score" | "mood">>,
  todayEnergy:   number,
  newStreak:     number,
  prevStreak:    number,
): Alert[] {
  const alerts: Alert[] = [];
  const today = new Date().toISOString().split("T")[0];

  // burnout_risk: energy ≤3 for 3+ consecutive days
  const lowDays = recentEntries.filter(e => e.energy_score <= 3);
  if (lowDays.length >= 3) {
    alerts.push({
      type:      "burnout_risk",
      message:   "Energy has been critically low for 3+ days.",
      triggered: today,
      severity:  "high",
    });
  }

  // streak_broken: had streak ≥5, now reset to 1
  if (prevStreak >= 5 && newStreak === 1) {
    alerts.push({
      type:      "streak_broken",
      message:   `Streak of ${prevStreak} days broken — back to day 1.`,
      triggered: today,
      severity:  "low",
    });
  }

  // sustained_decline: last 5 entries all below 5
  if (recentEntries.length >= 5 && recentEntries.slice(0, 5).every(e => e.energy_score < 5)) {
    alerts.push({
      type:      "sustained_decline",
      message:   "5-day sustained decline in energy.",
      triggered: today,
      severity:  "medium",
    });
  }

  // pattern_repeat: today's energy matches a strong baseline pattern signal
  // Simple heuristic: same score (±1) as 7 days ago AND below 4
  if (recentEntries.length >= 7 && Math.abs(recentEntries[6].energy_score - todayEnergy) <= 1 && todayEnergy <= 4) {
    alerts.push({
      type:      "pattern_repeat",
      message:   "Energy pattern repeating from last week — watch this cycle.",
      triggered: today,
      severity:  "medium",
    });
  }

  return alerts;
}

// ── updateWeeklyPatterns ───────────────────────────────────────────
// Called by Sunday cron. Runs Level 3 AI (Haiku) to detect patterns.
// Merges with existing recurring_patterns (max 10 kept by confidence).

export async function updateWeeklyPatterns(profileId: string): Promise<void> {
  const db = getSupabaseAdmin();

  const { data: profile, error: profileErr } = await db
    .from("pattern_profiles")
    .select("user_id, first_name, baseline_energy_cycle, baseline_growth_pattern, baseline_risk_pattern, current_season, streak_days, recurring_patterns, active_alerts")
    .eq("id", profileId)
    .single();
  if (profileErr) throw new Error(`updateWeeklyPatterns fetch: ${profileErr.message}`);

  const p = profile as Omit<PatternProfile, "id" | "report_id" | "email" | "last_entry_date" | "milestones" | "created_at" | "updated_at">;

  // Fetch last 30 entries
  const { data: entries } = await db
    .from("daily_entries")
    .select("entry_date, energy_score, mood, note")
    .eq("user_id", p.user_id)
    .order("entry_date", { ascending: false })
    .limit(30);

  const recentDays = (entries ?? []) as Array<Pick<DailyEntry, "entry_date" | "energy_score" | "mood" | "note">>;
  if (recentDays.length < 7) return;  // not enough data yet

  const context: AIContext = {
    first_name:              p.first_name ?? "you",
    baseline_energy_cycle:   p.baseline_energy_cycle,
    baseline_growth_pattern: p.baseline_growth_pattern,
    baseline_risk_pattern:   p.baseline_risk_pattern,
    current_season:          p.current_season,
    streak_days:             p.streak_days,
    top_patterns:            (p.recurring_patterns as PatternProfile["recurring_patterns"])
                               .slice(0, 3)
                               .map(rp => ({ title: rp.title, description: rp.description, confidence: rp.confidence })),
    active_alerts:           (p.active_alerts as PatternProfile["active_alerts"])
                               .map(a => ({ type: a.type, message: a.message })),
  };

  const newPatterns = await updateRecurringPatterns({ context, recentDays });
  if (!newPatterns.length) return;

  // Merge: deduplicate by title, sort by confidence desc, keep top 10
  const existing = (p.recurring_patterns as PatternProfile["recurring_patterns"]);
  const existingTitles = new Set(existing.map(rp => rp.title.toLowerCase()));
  const merged = [
    ...existing,
    ...newPatterns.filter(np => !existingTitles.has(np.title.toLowerCase())),
  ]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 10);

  await db
    .from("pattern_profiles")
    .update({ recurring_patterns: merged })
    .eq("id", profileId);
}

// ── Helpers ────────────────────────────────────────────────────────

function calculateStreak(lastDate: string | null, today: string, currentStreak: number): number {
  if (!lastDate) return 1;
  const last = new Date(lastDate);
  const curr = new Date(today);
  const diffDays = Math.round((curr.getTime() - last.getTime()) / 86400000);
  if (diffDays === 1) return currentStreak + 1;
  if (diffDays === 0) return currentStreak;  // same day re-submit
  return 1;  // gap → reset
}

function normalizeSeason(s: string): "spring" | "summer" | "autumn" | "winter" {
  const lower = s.toLowerCase();
  if (lower === "spring" || lower === "summer" || lower === "autumn" || lower === "winter") {
    return lower as "spring" | "summer" | "autumn" | "winter";
  }
  return "spring";
}
