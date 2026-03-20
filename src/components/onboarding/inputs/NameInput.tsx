"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  value: string;
  onComplete: (name: string) => void;
}

export default function NameInput({ value, onComplete }: Props) {
  const [name, setName] = useState(value);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(true);
      return;
    }
    onComplete(trimmed);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => { setName(e.target.value); setError(false); }}
        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
        placeholder="First name"
        autoComplete="given-name"
        className="font-sans text-lg w-full mb-2"
        style={{
          background:   "transparent",
          border:       "none",
          borderBottom: `1px solid ${error ? "var(--rust)" : "rgba(201,168,76,0.4)"}`,
          color:        "var(--cream)",
          padding:      "0.5rem 0 0.75rem",
          outline:      "none",
          caretColor:   "var(--gold)",
        }}
      />
      {error && (
        <p className="font-sans text-xs mb-4" style={{ color: "var(--rust)" }}>
          Please enter your first name.
        </p>
      )}
      <button
        onClick={handleSubmit}
        className="font-sans text-sm tracking-widest uppercase mt-6 transition-all duration-200"
        style={{
          background:    name.trim() ? "var(--gold)" : "rgba(201,168,76,0.3)",
          color:         "var(--ink)",
          border:        "none",
          padding:       "0.85rem 2.5rem",
          cursor:        name.trim() ? "pointer" : "default",
          fontWeight:    500,
          letterSpacing: "0.12em",
        }}
      >
        {"Let's begin \u2192"}
      </button>
    </div>
  );
}
