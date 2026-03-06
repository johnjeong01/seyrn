"use client";

import { useState } from "react";
import type { Option } from "@/lib/onboarding-config";

interface CardPickerProps {
  options:    Option[];
  value:      string | null;
  onComplete: (value: string) => void;
  columns?:   2 | 3;
}

export default function CardPicker({
  options,
  value,
  onComplete,
  columns = 2,
}: CardPickerProps) {
  const [selected, setSelected] = useState<string | null>(value);
  const [advancing, setAdvancing] = useState<string | null>(null);

  function handleSelect(optionValue: string) {
    setSelected(optionValue);
    setAdvancing(optionValue);
    // Brief pause so the user sees the selection before advancing
    setTimeout(() => onComplete(optionValue), 320);
  }

  return (
    <div
      className={`grid gap-3 ${
        columns === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2"
      }`}
    >
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        const isAdvancing = advancing === opt.value;

        return (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            disabled={advancing !== null}
            className="text-left transition-all duration-300 group"
            style={{
              background: isSelected
                ? "rgba(201,168,76,0.08)"
                : "rgba(255,255,255,0.025)",
              border: isSelected
                ? "1px solid rgba(201,168,76,0.5)"
                : "1px solid rgba(255,255,255,0.07)",
              padding: "1.25rem 1.5rem",
              opacity: advancing !== null && !isAdvancing ? 0.4 : 1,
              transform: isAdvancing ? "scale(0.99)" : "scale(1)",
            }}
          >
            {/* Icon if present */}
            {opt.icon && (
              <span
                className="block mb-3 text-lg"
                style={{
                  color: isSelected ? "var(--gold)" : "var(--muted)",
                  transition: "color 0.3s",
                }}
              >
                {opt.icon}
              </span>
            )}

            {/* Label */}
            <span
              className="block font-serif font-light mb-1"
              style={{
                fontSize:  "1.05rem",
                color:     isSelected ? "var(--cream)" : "var(--warm)",
                transition: "color 0.3s",
              }}
            >
              {opt.label}
            </span>

            {/* Description */}
            {opt.description && (
              <span
                className="block font-sans font-light text-xs leading-relaxed"
                style={{
                  color:     isSelected ? "rgba(245,240,232,0.7)" : "var(--muted)",
                  transition: "color 0.3s",
                }}
              >
                {opt.description}
              </span>
            )}

            {/* Selected check */}
            {isSelected && (
              <div className="absolute top-3 right-3">
                <div
                  className="w-5 h-5 flex items-center justify-center"
                  style={{
                    background:  "rgba(201,168,76,0.2)",
                    border:      "1px solid rgba(201,168,76,0.5)",
                    borderRadius: "50%",
                  }}
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
