"use client";

import type { Step } from "@/lib/onboarding-types";
import { getStageProgress } from "@/lib/onboarding-utils";

const STAGE_LABELS = [
  "Coordinates",
  "Turning Points",
  "Pattern Seeds",
  "Future",
  "Calibration",
];

interface ProgressBarProps {
  steps:      Step[];
  currentIdx: number;
}

export default function ProgressBar({ steps, currentIdx }: ProgressBarProps) {
  const progress   = getStageProgress(steps, currentIdx);
  const overallPct = Math.round(((currentIdx + 1) / steps.length) * 100);

  return (
    <div className="mb-12">
      {/* Stage pills */}
      <div className="flex gap-1 mb-4">
        {STAGE_LABELS.map((label, i) => {
          const stage    = (i + 1) as 1 | 2 | 3 | 4 | 5;
          const isActive = progress.stage === stage;
          const isPast   = progress.stage > stage;

          return (
            <div
              key={stage}
              className="flex-1 pb-1.5 text-center"
              style={{
                borderBottom: `2px solid ${
                  isActive ? "var(--gold)" :
                  isPast   ? "rgba(201,168,76,0.3)" :
                             "rgba(255,255,255,0.07)"
                }`,
              }}
            >
              <span
                className="font-sans text-[9px] tracking-[0.12em] uppercase hidden sm:block"
                style={{
                  color: isActive ? "var(--gold)" :
                         isPast   ? "rgba(201,168,76,0.45)" :
                                    "var(--muted)",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Overall thin progress line */}
      <div className="relative h-px" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div
          className="absolute left-0 top-0 h-full transition-all duration-500"
          style={{ width: `${overallPct}%`, background: "var(--gold)" }}
        />
      </div>

      {/* Stage 2 turning point sub-info */}
      {progress.stage === 2 && progress.tpInfo && progress.tpInfo.questionNum > 0 && (
        <p className="mt-3 font-sans text-[10px] tracking-[0.1em] uppercase text-[var(--muted)]">
          Turning Point {progress.tpInfo.tpNum} of {progress.tpInfo.tpTotal}
          {"  ·  "}
          Q{progress.tpInfo.questionNum} of 7
        </p>
      )}
    </div>
  );
}
