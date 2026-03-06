import type { Step, TurningPoint, OnboardingData } from "./onboarding-types";

// ── Create an empty turning point ──────────────────────────────

let _tpCounter = 0;
export function createEmptyTP(): TurningPoint {
  return {
    id:          `tp-${++_tpCounter}-${Date.now()}`,
    category:    null,
    year:        null,
    title:       "",
    energyLevel: 5,
    personType:  null,
    emotions:    [],
    outcome:     null,
    duration:    null,
  };
}

// ── Initial onboarding data ────────────────────────────────────
// We pre-initialize 3 turning points (minimum required)

export function getInitialData(): OnboardingData {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("seyrn-onboarding-data");
    if (saved) {
      try { return JSON.parse(saved) as OnboardingData; } catch { /* ignore */ }
    }
  }
  return {
    currentAge:      35,
    futureAge:       65,
    currentSeason:   null,
    turningPoints:   [createEmptyTP(), createEmptyTP(), createEmptyTP()],
    repeatedMistake: "",
    peakMoments:     "",
    growthPersonType: null,
    goals:           [],
    fear:            "",
    regret:          "",
    changeResponse:  null,
    energyPeak:      null,
    burnoutSignal:   null,
  };
}

// ── Step generation ────────────────────────────────────────────
// Generates the ordered flat list of wizard steps based on
// how many turning points exist in current data.

const TP_STEP_IDS = [
  "tp-category",
  "tp-year-title",
  "tp-energy",
  "tp-person",
  "tp-emotions",
  "tp-outcome",
  "tp-duration",
] as const;

export function generateSteps(tpCount: number): Step[] {
  const steps: Step[] = [];

  // Stage 1
  steps.push({ id: "age",    stage: 1 });
  steps.push({ id: "season", stage: 1 });

  // Stage 2 — one block per turning point
  for (let i = 0; i < tpCount; i++) {
    for (const id of TP_STEP_IDS) {
      steps.push({ id, stage: 2, tpIndex: i });
    }
    // Show "add more?" after the 3rd and 4th TP (not the 5th — that's the max)
    if (i >= 2 && i < 4) {
      steps.push({ id: "tp-add-more", stage: 2, tpIndex: i });
    }
  }

  // Stage 3
  steps.push({ id: "repeated-mistake", stage: 3 });
  steps.push({ id: "peak-moments",     stage: 3 });
  steps.push({ id: "growth-person",    stage: 3 });

  // Stage 4
  steps.push({ id: "goals",  stage: 4 });
  steps.push({ id: "fear",   stage: 4 });
  steps.push({ id: "regret", stage: 4 });

  // Stage 5
  steps.push({ id: "change-response", stage: 5 });
  steps.push({ id: "energy-peak",     stage: 5 });
  steps.push({ id: "burnout-signal",  stage: 5 });

  return steps;
}

// ── Stage progress calculation ─────────────────────────────────

export interface StageProgress {
  stage:         1 | 2 | 3 | 4 | 5;
  stageStepNum:  number;   // 1-based within stage
  stageTotal:    number;
  tpInfo?:       { tpNum: number; tpTotal: number; questionNum: number };
}

export function getStageProgress(
  steps: Step[],
  currentIdx: number
): StageProgress {
  const current = steps[currentIdx];
  const stageSteps = steps.filter((s) => s.stage === current.stage);
  const stageStepNum = stageSteps.findIndex(
    (s, i) => steps.indexOf(stageSteps[i]) === currentIdx
  ) + 1;

  if (current.stage === 2 && current.tpIndex !== undefined) {
    const tpTotal = Math.max(
      ...steps
        .filter((s) => s.stage === 2 && s.tpIndex !== undefined)
        .map((s) => (s.tpIndex ?? 0) + 1)
    );
    const questionNum = TP_STEP_IDS.indexOf(current.id as typeof TP_STEP_IDS[number]) + 1;
    return {
      stage:        current.stage,
      stageStepNum,
      stageTotal:   stageSteps.length,
      tpInfo: {
        tpNum:       current.tpIndex + 1,
        tpTotal,
        questionNum: questionNum > 0 ? questionNum : 0,
      },
    };
  }

  return {
    stage:        current.stage as 1 | 2 | 3 | 4 | 5,
    stageStepNum,
    stageTotal:   stageSteps.length,
  };
}

// ── Energy → color mapping ─────────────────────────────────────

export function energyColor(level: number): string {
  if (level >= 7) return "#4a6355"; // sage
  if (level <= 4) return "#8b4a2f"; // rust
  return "#c9a84c";                 // gold
}
