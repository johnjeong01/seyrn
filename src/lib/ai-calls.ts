// Phase 2: Three-level AI call system
// Level 1 — Haiku  (~$0.01) — daily insight
// Level 2 — Sonnet (~$0.06) — monthly report
// Level 3 — Haiku  (~$0.03) — recurring pattern detection

import Anthropic from "@anthropic-ai/sdk";
import type { AIContext, DailyEntry, RecurringPattern } from "./pattern-profile";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

// ── Level 1: Daily Insight ─────────────────────────────────────────
// Called once per user per day; result cached in daily_entries.daily_insight

export interface DailyInsightInput {
  context:     AIContext;
  entry:       Pick<DailyEntry, "entry_date" | "energy_score" | "mood" | "focus_area" | "note">;
  recentDays:  Array<Pick<DailyEntry, "entry_date" | "energy_score" | "mood">>;  // last 6 days
}

export async function generateDailyInsight(input: DailyInsightInput): Promise<string> {
  const { context, entry, recentDays } = input;

  const recentSummary = recentDays
    .map(d => `${d.entry_date}: energy ${d.energy_score}/10, ${d.mood}`)
    .join("\n");

  const notePart = entry.note ? `\nNote: "${entry.note.slice(0, 200)}"` : "";
  const focusPart = entry.focus_area ? `\nFocus: ${entry.focus_area.slice(0, 100)}` : "";

  const prompt = `You are a pattern analyst reviewing daily data for ${context.first_name}.

BASELINE PATTERNS:
- Energy cycle: ${context.baseline_energy_cycle.slice(0, 200)}
- Growth pattern: ${context.baseline_growth_pattern.slice(0, 200)}
- Risk pattern: ${context.baseline_risk_pattern.slice(0, 200)}

RECENT DAYS (oldest first):
${recentSummary}

TODAY (${entry.entry_date}):
- Energy: ${entry.energy_score}/10
- Mood: ${entry.mood}${focusPart}${notePart}

Active alerts: ${context.active_alerts.map(a => a.type).join(", ") || "none"}

Write a single insight for ${context.first_name} about today's data in relation to their pattern. 2–3 sentences. Specific to the numbers. No generic advice. No bullet points. Plain text only.`;

  const msg = await getClient().messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages:   [{ role: "user", content: prompt }],
  });

  const block = msg.content[0];
  return block.type === "text" ? block.text.trim() : "";
}

// ── Level 2: Monthly Report ────────────────────────────────────────
// Called once per user per month via cron; ~$0.06/user

export interface MonthlyReportInput {
  context:      AIContext;
  monthEntries: Array<Pick<DailyEntry, "entry_date" | "energy_score" | "mood" | "note">>;
  reportMonth:  string;  // YYYY-MM
}

export interface MonthlyReportOutput {
  summary:       string;
  pattern_shift: string;
  next_month:    string;
}

export async function generateMonthlyReport(input: MonthlyReportInput): Promise<MonthlyReportOutput> {
  const { context, monthEntries, reportMonth } = input;

  const avgEnergy = monthEntries.length
    ? (monthEntries.reduce((s, e) => s + e.energy_score, 0) / monthEntries.length).toFixed(1)
    : "N/A";

  const moodCounts = monthEntries.reduce<Record<string, number>>((acc, e) => {
    acc[e.mood] = (acc[e.mood] ?? 0) + 1;
    return acc;
  }, {});

  const notesSample = monthEntries
    .filter(e => e.note)
    .slice(-5)
    .map(e => `${e.entry_date}: "${e.note!.slice(0, 150)}"`)
    .join("\n");

  const topPatterns = context.top_patterns
    .map(p => `- ${p.title} (confidence: ${(p.confidence * 100).toFixed(0)}%)`)
    .join("\n");

  const prompt = `You are Seyrn's pattern analyst writing a monthly report for ${context.first_name}.

BASELINE PATTERNS:
- Energy cycle: ${context.baseline_energy_cycle.slice(0, 200)}
- Growth: ${context.baseline_growth_pattern.slice(0, 200)}

MONTH: ${reportMonth}
Entries recorded: ${monthEntries.length}/~30
Average energy: ${avgEnergy}/10
Mood distribution: ${JSON.stringify(moodCounts)}

CURRENT SEASON: ${context.current_season}
STREAK: ${context.streak_days} days

TOP DETECTED PATTERNS:
${topPatterns || "none yet"}

RECENT NOTES SAMPLE:
${notesSample || "none"}

Return JSON only, no markdown:
{
  "summary": "2-3 sentence overview of this month's pattern data",
  "pattern_shift": "1-2 sentences on how this month compares to baseline — did patterns strengthen or shift?",
  "next_month": "1-2 sentences on what the pattern suggests for next month based on cycles"
}`;

  const msg = await getClient().messages.create({
    model:      "claude-sonnet-4-6",
    max_tokens: 600,
    messages:   [{ role: "user", content: prompt }],
  });

  const block = msg.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type from monthly report AI");

  const text  = block.text.trim();
  const start = text.indexOf("{");
  const end   = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Invalid JSON from monthly report AI");

  return JSON.parse(text.slice(start, end + 1)) as MonthlyReportOutput;
}

// ── Level 3: Recurring Pattern Detection ──────────────────────────
// Called weekly via cron; updates pattern_profiles.recurring_patterns

export interface PatternDetectionInput {
  context:     AIContext;
  recentDays:  Array<Pick<DailyEntry, "entry_date" | "energy_score" | "mood" | "note">>;  // last 30 days
}

export async function updateRecurringPatterns(input: PatternDetectionInput): Promise<RecurringPattern[]> {
  const { context, recentDays } = input;

  const entrySummary = recentDays
    .map(e => `${e.entry_date}: energy ${e.energy_score}/10, ${e.mood}`)
    .join("\n");

  const existingPatterns = context.top_patterns
    .map(p => `- ${p.title}: ${p.description.slice(0, 150)}`)
    .join("\n");

  const today = new Date().toISOString().split("T")[0];

  const prompt = `You are detecting behavioral patterns from ${context.first_name}'s daily entry data.

BASELINE:
- Energy cycle: ${context.baseline_energy_cycle.slice(0, 200)}
- Growth pattern: ${context.baseline_growth_pattern.slice(0, 200)}

EXISTING DETECTED PATTERNS:
${existingPatterns || "none"}

LAST 30 DAYS DATA:
${entrySummary}

Identify 1–3 recurring patterns visible in this data. Focus on patterns NOT already captured in baseline. Look for: energy cycles, mood triggers, consistency patterns, improvement or decline trends.

Return JSON array only, no markdown:
[
  {
    "type": "energy_cycle|risk_trigger|growth_condition|mood_pattern|consistency",
    "title": "short title (5-8 words)",
    "description": "1-2 sentences specific to the data",
    "evidence": ["YYYY-MM-DD", "YYYY-MM-DD"],
    "confidence": 0.0,
    "first_seen": "${today}",
    "last_updated": "${today}"
  }
]

If no new patterns are detectable, return [].`;

  const msg = await getClient().messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 600,
    messages:   [{ role: "user", content: prompt }],
  });

  const block = msg.content[0];
  if (block.type !== "text") return [];

  const text  = block.text.trim();
  const start = text.indexOf("[");
  const end   = text.lastIndexOf("]");
  if (start === -1 || end === -1) return [];

  try {
    return JSON.parse(text.slice(start, end + 1)) as RecurringPattern[];
  } catch {
    return [];
  }
}
