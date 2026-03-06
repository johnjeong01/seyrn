"use client";

import { useState } from "react";

interface TextQuestionProps {
  value:       string;
  placeholder: string;
  maxLength?:  number;
  onComplete:  (value: string) => void;
}

export default function TextQuestion({
  value: initialValue,
  placeholder,
  maxLength = 400,
  onComplete,
}: TextQuestionProps) {
  const [value, setValue] = useState(initialValue);
  const canContinue = value.trim().length > 10;

  return (
    <div>
      <div className="relative mb-10">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={4}
          autoFocus
          className="w-full bg-transparent font-sans font-light text-[var(--cream)] outline-none resize-none placeholder:text-[var(--muted)]/40"
          style={{
            fontSize:  "1.1rem",
            lineHeight: 1.75,
            borderBottom: "1px solid rgba(255,255,255,0.15)",
            paddingBottom: "0.75rem",
          }}
        />
        <div className="flex justify-end mt-2">
          <span className="font-sans text-[10px] text-[var(--muted)]/40">
            {value.length}/{maxLength}
          </span>
        </div>
      </div>

      <button
        onClick={() => canContinue && onComplete(value.trim())}
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
