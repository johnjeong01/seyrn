// Phase 2: TypeScript types for subscription-tier data structures

export interface RecurringPattern {
  type:        string;   // "energy_cycle" | "risk_trigger" | "growth_condition" | etc.
  title:       string;
  description: string;
  evidence:    string[]; // ISO date strings of supporting daily entries
  confidence:  number;   // 0–1
  first_seen:  string;   // ISO date
  last_updated: string;  // ISO date
}

export interface Alert {
  type:      "burnout_risk" | "streak_broken" | "sustained_decline" | "pattern_repeat";
  message:   string;
  triggered: string;     // ISO date
  severity:  "low" | "medium" | "high";
}

export interface Milestone {
  date:        string;   // ISO date
  description: string;
  energy:      number;
}

export interface PatternProfile {
  id:         string;
  user_id:    string | null;
  report_id:  string | null;
  email:      string | null;
  first_name: string | null;

  // Baseline (immutable — set from initial ReportData)
  baseline_energy_cycle:   string;
  baseline_growth_pattern: string;
  baseline_risk_pattern:   string;

  // Living context
  current_season:  "spring" | "summer" | "autumn" | "winter";
  streak_days:     number;
  last_entry_date: string | null;  // ISO date

  // Compressed AI context
  recurring_patterns: RecurringPattern[];  // max 10
  active_alerts:      Alert[];
  milestones:         Milestone[];         // max 20

  created_at: string;
  updated_at: string;
}

export interface DailyEntry {
  id:           string;
  user_id:      string;
  entry_date:   string;  // YYYY-MM-DD
  energy_score: number;  // 1–10
  mood:         "thriving" | "steady" | "struggling" | "drained";
  focus_area:   string | null;
  note:         string | null;     // max 300 chars enforced at API layer
  daily_insight: string | null;    // cached Level 1 AI output
  created_at:   string;
}

// Compressed context passed to AI — never full history
export interface AIContext {
  first_name:              string;
  baseline_energy_cycle:   string;
  baseline_growth_pattern: string;
  baseline_risk_pattern:   string;
  current_season:          string;
  streak_days:             number;
  top_patterns:            Pick<RecurringPattern, "title" | "description" | "confidence">[];  // top 3
  active_alerts:           Pick<Alert, "type" | "message">[];
}
