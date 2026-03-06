"use client";

import { useState } from "react";
import type { Option } from "@/lib/onboarding-config";

interface MultiCardPickerProps {
  options:    Option[];
  values:     string[];
  max?:       number;
  minToNext?: number;
  onComplete: (values: string[]) => void;
}

export default function MultiCardPicker({
  options,
  values: initialValues,
  max       = 99,
  minToNext = 1,
  onComplete,
}: MultiCardPickerProps) {
  const [selected, setSelected] = useState<string[]>(initialValues);

  function toggle(value: string) {
    setSelected((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (prev.length >= max) return prev; // at max, ignore
      return [...prev, value];
    });
  }

  const canContinue = selected.length >= minToNext;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          const isAtMax    = selected.length >= max && !isSelected;

          return (
            <button
              key={opt.value}
              onClick={() => !isAtMax && toggle(opt.value)}
              disabled={isAtMax}
              className="text-left transition-all duration-200"
              style={{
                padding:    "1rem 1.25rem",
                background: isSelected ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.025)",
                border:     isSelected
                  ? "1px solid rgba(201,168,76,0.5)"
                  : "1px solid rgba(255,255,255,0.07)",
                opacity:    isAtMax ? 0.35 : 1,
              }}
            >
              <span
                className="block font-sans font-light text-sm"
                style={{ color: isSelected ? "var(--cream)" : "var(--warm)" }}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selection count + Continue */}
      <div className="flex items-center justify-between">
        <span className="font-sans text-xs text-[var(--muted)]">
          {selected.length > 0
            ? `${selected.length} selected${max < 99 ? ` / ${max} max` : ""}`
            : `Select at least ${minToNext}`}
        </span>
        <button
          onClick={() => canContinue && onComplete(selected)}
          disabled={!canContinue}
          className="font-sans text-sm tracking-widest uppercase px-8 py-3 transition-all duration-300"
          style={{
            background: canContinue ? "var(--gold)" : "rgba(255,255,255,0.06)",
            color:      canContinue ? "var(--ink)"  : "var(--muted)",
            cursor:     canContinue ? "pointer"     : "not-allowed",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
