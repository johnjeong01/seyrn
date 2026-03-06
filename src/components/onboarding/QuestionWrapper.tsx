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
  children:       ReactNode;
}

export default function QuestionWrapper({
  steps,
  currentIdx,
  context,
  question,
  turningPoints,
  children,
}: QuestionWrapperProps) {
  return (
    <div>
      <ProgressBar steps={steps} currentIdx={currentIdx} />

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
      </div>
    </div>
  );
}
