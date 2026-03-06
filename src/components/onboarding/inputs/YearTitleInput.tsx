"use client";

import { useState } from "react";

interface YearTitleInputProps {
  year:       number | null;
  title:      string;
  currentAge: number;
  onComplete: (year: number, title: string) => void;
}

export default function YearTitleInput({
  year:        initialYear,
  title:       initialTitle,
  currentAge,
  onComplete,
}: YearTitleInputProps) {
  const currentYear  = new Date().getFullYear();
  const [year,  setYear]  = useState<string>(initialYear ? String(initialYear) : "");
  const [title, setTitle] = useState(initialTitle);

  const yearNum  = parseInt(year);
  const yearOk   = year.length === 4 && yearNum >= 1950 && yearNum <= currentYear;
  const canContinue = yearOk && title.trim().length > 0;

  // Age at event (approximate)
  const ageAtEvent = yearNum ? currentAge - (currentYear - yearNum) : null;

  return (
    <div>
      {/* Year input */}
      <div className="mb-8">
        <label className="block font-sans text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-3">
          Year
        </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder={String(currentYear - 5)}
          min={1950}
          max={currentYear}
          className="w-32 bg-transparent font-serif font-light text-[var(--cream)] outline-none"
          style={{
            fontSize:     "2.5rem",
            lineHeight:   1,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            paddingBottom: "0.25rem",
          }}
        />
        {ageAtEvent !== null && ageAtEvent > 0 && ageAtEvent < 100 && (
          <p className="mt-2 font-sans text-xs text-[var(--muted)]">
            You were {ageAtEvent} years old
          </p>
        )}
      </div>

      {/* Title input */}
      <div className="mb-10">
        <label className="block font-sans text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-3">
          One-sentence title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Left everything to start over"
          maxLength={80}
          className="w-full bg-transparent font-sans font-light text-[var(--cream)] outline-none placeholder:text-[var(--muted)]/40"
          style={{
            fontSize:     "1.15rem",
            lineHeight:   1.5,
            borderBottom: "1px solid rgba(255,255,255,0.15)",
            paddingBottom: "0.5rem",
          }}
          autoFocus
        />
        <div className="flex justify-between mt-2">
          <span />
          <span className="font-sans text-[10px] text-[var(--muted)]/40">
            {title.length}/80
          </span>
        </div>
      </div>

      {/* Preview */}
      {canContinue && (
        <div
          className="flex items-center gap-3 p-4 mb-8"
          style={{ border: "1px solid rgba(201,168,76,0.1)", background: "rgba(201,168,76,0.04)" }}
        >
          <span
            className="font-serif text-[var(--gold)] font-light shrink-0"
            style={{ fontSize: "1.5rem" }}
          >
            {year}
          </span>
          <span className="font-sans text-[var(--warm)] text-sm">— {title}</span>
        </div>
      )}

      <button
        onClick={() => canContinue && onComplete(yearNum, title.trim())}
        disabled={!canContinue}
        className="w-full sm:w-auto font-sans text-sm tracking-widest uppercase px-10 py-3.5 transition-all duration-300"
        style={{
          background: canContinue ? "var(--gold)" : "rgba(255,255,255,0.06)",
          color:      canContinue ? "var(--ink)"  : "var(--muted)",
          cursor:     canContinue ? "pointer"     : "not-allowed",
        }}
      >
        Continue
      </button>
    </div>
  );
}
