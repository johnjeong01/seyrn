// Cron: 30th of each month at 09:00 UTC
// Generates monthly pattern report for active subscribers

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { generateMonthlyReport } from "@/lib/ai-calls";
import type { AIContext, DailyEntry } from "@/lib/pattern-profile";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getSupabaseAdmin();
  const now = new Date();
  // Report covers previous month
  const reportMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    .toISOString()
    .split("T")[0];  // e.g. "2026-04-01"
  const monthPrefix = reportMonth.slice(0, 7);  // "2026-04"

  // Active subscribers with profiles
  const { data: subs } = await db
    .from("subscriptions")
    .select("user_id, email")
    .eq("status", "active")
    .not("user_id", "is", null);

  const subscribers = (subs ?? []) as Array<{ user_id: string; email: string }>;

  let succeeded = 0;
  let failed = 0;

  for (const sub of subscribers) {
    try {
      // Skip if already generated
      const { data: existing } = await db
        .from("monthly_reports")
        .select("id")
        .eq("user_id", sub.user_id)
        .eq("report_month", reportMonth)
        .maybeSingle();
      if (existing) continue;

      // Fetch profile
      const { data: profile } = await db
        .from("pattern_profiles")
        .select("first_name, baseline_energy_cycle, baseline_growth_pattern, baseline_risk_pattern, current_season, streak_days, recurring_patterns, active_alerts")
        .eq("user_id", sub.user_id)
        .maybeSingle();
      if (!profile) continue;

      type ProfileRow = {
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

      // Fetch month entries
      const { data: entries } = await db
        .from("daily_entries")
        .select("entry_date, energy_score, mood, note")
        .eq("user_id", sub.user_id)
        .like("entry_date", `${monthPrefix}%`)
        .order("entry_date", { ascending: true });

      const monthEntries = (entries ?? []) as Array<Pick<DailyEntry, "entry_date" | "energy_score" | "mood" | "note">>;
      if (monthEntries.length < 5) continue;  // skip if too few entries

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

      const result = await generateMonthlyReport({ context, monthEntries, reportMonth: monthPrefix });

      await db.from("monthly_reports").insert({
        user_id:      sub.user_id,
        report_month: reportMonth,
        summary:      result.summary,
        pattern_shift: result.pattern_shift,
        next_month:   result.next_month,
        full_report:  result,
        generated_at: new Date().toISOString(),
      });

      succeeded++;
    } catch (err) {
      failed++;
      console.error(`monthly-report: user ${sub.user_id} failed`, err);
    }
  }

  console.log(`monthly-report cron: ${succeeded} succeeded, ${failed} failed`);
  return NextResponse.json({ succeeded, failed, reportMonth });
}
