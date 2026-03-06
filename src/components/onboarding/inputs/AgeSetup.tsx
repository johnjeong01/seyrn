"use client";

import { useState } from "react";

interface AgeSetupProps {
  currentAge: number;
  futureAge:  number;
  onComplete: (currentAge: number, futureAge: number) => void;
}

function AgeSlider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label:    string;
  value:    number;
  min:      number;
  max:      number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-10">
      <div className="flex items-end justify-between mb-4">
        <span className="font-sans text-xs tracking-widest uppercase text-[var(--muted)]">
          {label}
        </span>
        <span
          className="font-serif font-light text-[var(--gold)]"
          style={{ fontSize: "2.5rem", lineHeight: 1 }}
        >
          {value}
        </span>
      </div>

      {/* Custom slider track */}
      <div className="relative h-1 w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        {/* Filled portion */}
        <div
          className="absolute left-0 top-0 h-full transition-all duration-150"
          style={{
            width:      `${pct}%`,
            background: "linear-gradient(90deg, rgba(201,168,76,0.4) 0%, var(--gold) 100%)",
          }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 transition-all duration-150"
          style={{
            left:       `${pct}%`,
            background: "var(--gold)",
            borderRadius: "50%",
            boxShadow:  "0 0 0 4px rgba(201,168,76,0.2)",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ margin: 0 }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <span className="font-sans text-[10px] text-[var(--muted)]/50">{min}</span>
        <span className="font-sans text-[10px] text-[var(--muted)]/50">{max}</span>
      </div>
    </div>
  );
}

export default function AgeSetup({ currentAge, futureAge, onComplete }: AgeSetupProps) {
  const [currAge, setCurrAge] = useState(currentAge);
  const [futAge,  setFutAge]  = useState(futureAge);

  const yearSpan = futAge - currAge;

  return (
    <div>
      <AgeSlider
        label="Current age"
        value={currAge}
        min={18}
        max={75}
        onChange={(v) => {
          setCurrAge(v);
          if (futAge <= v + 5) setFutAge(v + 10);
        }}
      />
      <AgeSlider
        label="How far ahead to map"
        value={futAge}
        min={currAge + 5}
        max={100}
        onChange={setFutAge}
      />

      {/* Summary */}
      <div
        className="flex items-center gap-4 p-4 mb-8"
        style={{ border: "1px solid rgba(201,168,76,0.12)", background: "rgba(201,168,76,0.04)" }}
      >
        <div className="flex-1">
          <p className="font-sans text-xs text-[var(--muted)] mb-0.5">Your life graph</p>
          <p className="font-serif font-light text-[var(--cream)] text-lg">
            Ages {currAge} → {futAge}
          </p>
        </div>
        <div className="text-right">
          <p className="font-sans text-xs text-[var(--muted)] mb-0.5">Looking ahead</p>
          <p className="font-serif font-light text-[var(--gold)] text-lg">{yearSpan} years</p>
        </div>
      </div>

      <button
        onClick={() => onComplete(currAge, futAge)}
        className="w-full sm:w-auto font-sans text-sm tracking-widest uppercase px-10 py-3.5 transition-all duration-300"
        style={{
          background: "var(--gold)",
          color:      "var(--ink)",
        }}
      >
        Continue
      </button>
    </div>
  );
}
