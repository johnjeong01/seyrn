"use client";

import { useState } from "react";

interface Props {
  value: string;
  onComplete: (email: string) => void;
}

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

export default function EmailInput({ value: initialValue, onComplete }: Props) {
  const [email, setEmail] = useState(initialValue);
  const [error, setError] = useState("");
  const canContinue = isValidEmail(email);

  const handleSubmit = () => {
    if (!canContinue) {
      setError("Please enter a valid email address.");
      return;
    }
    onComplete(email.trim().toLowerCase());
  };

  return (
    <div>
      <div className="relative mb-10">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="you@example.com"
          autoFocus
          autoComplete="email"
          className="w-full bg-transparent font-sans font-light text-[var(--cream)] outline-none placeholder:text-[var(--muted)]/40"
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.75,
            borderBottom: `1px solid ${error ? "var(--rust)" : "rgba(255,255,255,0.15)"}`,
            paddingBottom: "0.75rem",
          }}
        />
        {error && (
          <p
            className="font-sans text-xs mt-2"
            style={{ color: "var(--rust)" }}
          >
            {error}
          </p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canContinue}
        className="w-full sm:w-auto font-sans text-sm tracking-widest uppercase px-10 py-3.5 transition-all duration-300"
        style={{
          background: canContinue ? "var(--gold)" : "rgba(255,255,255,0.06)",
          color: canContinue ? "var(--ink)" : "var(--muted)",
          cursor: canContinue ? "pointer" : "not-allowed",
        }}
      >
        Continue →
      </button>

      <p
        className="font-sans text-xs mt-5"
        style={{ color: "var(--muted)", opacity: 0.7, lineHeight: 1.6 }}
      >
        We&apos;ll send your report link here. No password needed.
      </p>
    </div>
  );
}
