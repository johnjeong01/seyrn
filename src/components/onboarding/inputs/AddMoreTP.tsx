"use client";

import { energyColor } from "@/lib/onboarding-utils";
import type { TurningPoint } from "@/lib/onboarding-types";

interface AddMoreTPProps {
  completedCount:   number;
  turningPoints:    TurningPoint[];
  onAddMore:        () => void;
  onContinue:       () => void;
}

export default function AddMoreTP({
  completedCount,
  turningPoints,
  onAddMore,
  onContinue,
}: AddMoreTPProps) {
  const canAddMore = completedCount < 5;

  return (
    <div>
      {/* Summary of turning points entered so far */}
      <div className="mb-10">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-5">
          {completedCount} turning point{completedCount !== 1 ? "s" : ""} mapped
        </p>

        <div className="space-y-2">
          {turningPoints.slice(0, completedCount).map((tp) => (
            <div
              key={tp.id}
              className="flex items-center gap-4 px-4 py-3"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Energy dot */}
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: energyColor(tp.energyLevel) }}
              />
              {/* Year + title */}
              <div className="flex-1 min-w-0">
                <span className="font-sans text-xs text-[var(--muted)] mr-3">{tp.year}</span>
                <span className="font-sans text-sm text-[var(--warm)] truncate">{tp.title}</span>
              </div>
              {/* Energy */}
              <span
                className="font-serif text-sm shrink-0"
                style={{ color: energyColor(tp.energyLevel) }}
              >
                {tp.energyLevel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Decision */}
      <p className="font-sans text-sm text-[var(--muted)] mb-6">
        {canAddMore
          ? "More turning points = sharper pattern analysis. You can add up to 5."
          : "You've reached the maximum of 5 turning points."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {canAddMore && (
          <button
            onClick={onAddMore}
            className="flex-1 font-sans text-sm tracking-widest uppercase px-8 py-3.5 transition-all duration-300"
            style={{
              border:  "1px solid rgba(201,168,76,0.4)",
              color:   "var(--gold)",
            }}
          >
            Add another
          </button>
        )}
        <button
          onClick={onContinue}
          className="flex-1 font-sans text-sm tracking-widest uppercase px-8 py-3.5 transition-all duration-300"
          style={{
            background: "var(--gold)",
            color:      "var(--ink)",
          }}
        >
          {canAddMore ? "That's enough — continue" : "Continue to analysis"}
        </button>
      </div>
    </div>
  );
}
