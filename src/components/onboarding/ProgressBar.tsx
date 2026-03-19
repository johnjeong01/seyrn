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
  steps:          Step[];
  currentIdx:     number;
  onStageClick?:  (firstStepIdxInStage: number) => void;
}

export default function ProgressBar({ steps, currentIdx, onStageClick }: ProgressBarProps) {
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
          const isClickable = isPast && !!onStageClick;

          // Find the first step index belonging to this stage
          const firstIdxInStage = steps.findIndex((s) => s.stage === stage);

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
                cursor: isClickable ? "pointer" : "default",
              }}
              onClick={() => {
                if (isClickable && firstIdxInStage !== -1) {
                  onStageClick(firstIdxInStage);
                }
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

      {/* Stage 2 — turning point tracker */}
      {progress.stage === 2 && progress.tpInfo && (
        <div className="mt-4 flex gap-3">
          {Array.from({ length: progress.tpInfo.tpTotal }, (_, i) => {
            const tpNum        = i + 1;
            const isCurrent    = tpNum === progress.tpInfo!.tpNum;
            const isPast       = tpNum < progress.tpInfo!.tpNum;
            // questionNum===0 means we're on tp-add-more (all 7 done)
            const qFilled      = isPast ? 7 : isCurrent ? (progress.tpInfo!.questionNum || 7) : 0;

            return (
              <div key={tpNum} className="flex-1">
                <p
                  className="font-sans text-[9px] tracking-[0.1em] uppercase mb-2"
                  style={{
                    color: isCurrent ? "var(--gold)"
                         : isPast    ? "rgba(201,168,76,0.45)"
                         :             "var(--muted)",
                  }}
                >
                  Turning Point {tpNum}
                </p>

                {/* 7 question bars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 7 }, (_, q) => (
                    <div
                      key={q}
                      className="h-[3px] flex-1 rounded-full transition-all duration-300"
                      style={{
                        background: q < qFilled
                          ? (isCurrent ? "var(--gold)" : "rgba(201,168,76,0.3)")
                          : "rgba(255,255,255,0.07)",
                      }}
                    />
                  ))}
                </div>

                {/* Status label */}
                <p
                  className="font-sans text-[8px] tracking-[0.08em] uppercase mt-1.5"
                  style={{
                    color: isCurrent ? "rgba(201,168,76,0.6)"
                         : isPast    ? "rgba(201,168,76,0.3)"
                         :             "rgba(255,255,255,0.15)",
                  }}
                >
                  {isPast    ? "Complete"
                 : isCurrent && progress.tpInfo!.questionNum > 0
                             ? `Q${progress.tpInfo!.questionNum} of 7`
                 : isCurrent ? "Complete"
                 :             "Upcoming"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
