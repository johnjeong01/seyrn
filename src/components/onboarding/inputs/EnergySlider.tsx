"use client";

import { useState } from "react";
import { energyColor } from "@/lib/onboarding-utils";

const ENERGY_LABELS: Record<number, string> = {
  1: "Completely drained",
  2: "Very low",
  3: "Low",
  4: "Below average",
  5: "Neutral",
  6: "Slightly energized",
  7: "Energized",
  8: "High energy",
  9: "Very high",
  10: "Fully alive",
};

interface EnergySliderProps {
  value:      number;
  onComplete: (value: number) => void;
}

export default function EnergySlider({ value: initialValue, onComplete }: EnergySliderProps) {
  const [value, setValue] = useState(initialValue);
  const color  = energyColor(value);

  return (
    <div>
      {/* Big number display */}
      <div className="flex items-end gap-4 mb-10">
        <span
          className="font-serif font-light transition-all duration-300"
          style={{
            fontSize:  "6rem",
            lineHeight: 1,
            color,
          }}
        >
          {value}
        </span>
        <div className="mb-3">
          <span className="font-sans text-lg text-[var(--muted)]">/ 10</span>
          <p
            className="font-serif italic mt-1 transition-all duration-300"
            style={{ color, fontSize: "1.15rem" }}
          >
            {ENERGY_LABELS[value]}
          </p>
        </div>
      </div>

      {/* Dot scale (visual only) */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setValue(n)}
            className="flex-1 transition-all duration-200"
            style={{
              height:       n <= value ? "20px" : "8px",
              background:   n <= value ? color : "rgba(255,255,255,0.08)",
              borderRadius: "2px",
            }}
          />
        ))}
      </div>

      {/* Range input (invisible, for drag) */}
      <div className="relative h-0 mb-10">
        <input
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer"
          style={{ height: "40px", top: "-20px", margin: 0 }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="font-sans text-xs text-[var(--muted)]">
          Drag or tap to adjust
        </span>
        <button
          onClick={() => onComplete(value)}
          className="font-sans text-sm tracking-widest uppercase px-8 py-3 transition-all duration-300"
          style={{ background: "var(--gold)", color: "var(--ink)" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
