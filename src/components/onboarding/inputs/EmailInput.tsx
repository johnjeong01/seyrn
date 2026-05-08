"use client";

import Link from "next/link";
import { useState } from "react";

interface Props {
  value: string;
  onComplete: (email: string) => void;
}

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

export default function EmailInput({ value: initialValue, onComplete }: Props) {
  const [email, setEmail] = useState(initialValue);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const canContinue = isValidEmail(email) && agreed;

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

      {/* Consent checkbox */}
      <label
        className="flex items-start gap-3 mb-8 cursor-pointer"
        style={{ userSelect: "none" }}
      >
        <div
          className="relative shrink-0 mt-0.5"
          style={{ width: "16px", height: "16px" }}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            style={{ zIndex: 1 }}
          />
          <div
            style={{
              width: "16px",
              height: "16px",
              border: agreed ? "1px solid var(--gold)" : "1px solid rgba(255,255,255,0.2)",
              background: agreed ? "var(--gold)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            {agreed && (
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5L3.5 6L8 1" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
        <span className="font-sans text-xs leading-[1.7]" style={{ color: "var(--muted)" }}>
          I agree to the{" "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--cream)] transition-colors"
            style={{ color: "var(--warm)" }}
          >
            Privacy Policy
          </Link>
          {" "}and{" "}
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--cream)] transition-colors"
            style={{ color: "var(--warm)" }}
          >
            Terms of Service
          </Link>
        </span>
      </label>

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
