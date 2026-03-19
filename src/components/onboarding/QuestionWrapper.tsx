"use client";

import type { ReactNode } from "react";
import type { Step, TurningPoint } from "@/lib/onboarding-types";
import ProgressBar from "./ProgressBar";
import MiniGraph   from "./MiniGraph";

interface QuestionWrapperProps {
  steps:          Step[];
  currentIdx:     number;
  context:        string;
  question:       string;
  turningPoints?: TurningPoint[];
  onBack?:        () => void;
  onStageClick?:  (firstStepIdxInStage: number) => void;
  children:       ReactNode;
}

export default function QuestionWrapper({
  steps,
  currentIdx,
  context,
  question,
  turningPoints,
  onBack,
  onStageClick,
  children,
}: QuestionWrapperProps) {
  return (
    <div>
      <ProgressBar steps={steps} currentIdx={currentIdx} onStageClick={onStageClick} />

      <div style={{ animation: "fadeUp 0.45s ease-out forwards" }}>
        {/* Context sentence */}
        <p className="font-sans text-xs tracking-[0.18em] uppercase text-[var(--muted)] mb-5">
          {context}
        </p>

        {/* Question headline */}
        <h2
          className="font-serif font-light text-[var(--cream)] mb-10"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", lineHeight: 1.2 }}
        >
          {question}
        </h2>

        {/* Mini life graph — only shown in Stage 2 when data exists */}
        {turningPoints && <MiniGraph turningPoints={turningPoints} />}

        {children}

        {/* Back button — shown from step 2 onwards */}
        {onBack && currentIdx > 0 && (
          <div className="mt-10">
            <button
              onClick={onBack}
              className="font-sans text-sm transition-colors"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                padding: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cream)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; }}
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
