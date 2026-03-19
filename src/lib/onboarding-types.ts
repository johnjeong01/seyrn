// ── Core enum types ────────────────────────────────────────────

export type Season        = "spring" | "summer" | "autumn" | "winter";
export type TPCategory    = "career" | "relationship" | "place" | "inner-shift" | "loss-failure" | "leap-success";
export type PersonType    = "mentor" | "partner" | "rival" | "alone";
export type Emotion       = "excitement" | "fear" | "certainty" | "confusion" | "anger" | "peace";
export type Outcome       = "grew" | "stagnated" | "direction-changed" | "fell-apart-rebuilt";
export type Duration      = "under-3mo" | "6mo" | "1yr" | "over-1yr";
export type GrowthPerson  = "direct-advice" | "silent-example" | "competitor" | "stayed-failure";
export type Goal          = "career-peak" | "financial-freedom" | "meaningful-relationships" | "health-energy" | "create-own";
export type ChangeResponse = "prepare-advance" | "adapt-arrival" | "avoid-delay" | "lean-in";
export type EnergyPeak    = "starting-new" | "results-visible" | "with-others" | "deep-focus";
export type BurnoutSignal = "sleep" | "withdrawing" | "reactive" | "future-stops";

// ── Turning point ──────────────────────────────────────────────

export interface TurningPoint {
  id:          string;
  category:    TPCategory | null;
  year:        number | null;
  title:       string;
  energyLevel: number;        // 1–10
  personType:  PersonType | null;
  emotions:    Emotion[];
  outcome:     Outcome | null;
  duration:    Duration | null;
}

// ── Full onboarding data ───────────────────────────────────────

export interface OnboardingData {
  // Pre-stage (collected before age setup)
  email?: string;

  // Stage 1
  currentAge:   number;
  futureAge:    number;
  currentSeason: Season | null;

  // Stage 2
  turningPoints: TurningPoint[];

  // Stage 3
  repeatedMistake:  string;
  peakMoments:      string;
  growthPersonType: GrowthPerson | null;

  // Stage 4
  goals:  Goal[];
  fear:   string;
  regret: string;

  // Stage 5
  changeResponse: ChangeResponse | null;
  energyPeak:     EnergyPeak | null;
  burnoutSignal:  BurnoutSignal | null;
}

// ── Wizard step ───────────────────────────────────────────────

export interface Step {
  id:       string;
  stage:    1 | 2 | 3 | 4 | 5;
  tpIndex?: number;   // only for stage 2 steps
}
