"use client";

import { useState, useEffect } from "react";

interface Props {
  onClose: () => void;
  /** Pre-filled email from onboarding localStorage — may be empty */
  prefillEmail?: string;
}

export default function WaitlistModal({ onClose, prefillEmail }: Props) {
  const [email, setEmail] = useState(prefillEmail ?? "");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Try to prefill from localStorage if not passed as prop
  useEffect(() => {
    if (!prefillEmail) {
      try {
        const raw = localStorage.getItem("seyrn-onboarding-data");
        if (raw) {
          const parsed = JSON.parse(raw) as { email?: string };
          if (parsed.email) setEmail(parsed.email);
        }
      } catch { /* ignore */ }
    }
  }, [prefillEmail]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = (await res.json()) as { success?: boolean; error?: string };
      if (body.success) {
        setDone(true);
      } else {
        setError(body.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,14,12,0.85)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "var(--deep)",
          border: "1px solid rgba(201,168,76,0.2)",
          maxWidth: "420px",
          width: "100%",
          padding: "2.5rem",
        }}
      >
        {done ? (
          /* Confirmation state */
          <div className="text-center">
            <p
              className="font-sans text-xs tracking-[0.25em] uppercase mb-4"
              style={{ color: "var(--gold)" }}
            >
              You&apos;re on the list
            </p>
            <p
              className="font-serif font-light mb-3"
              style={{ fontSize: "1.5rem", color: "var(--cream)" }}
            >
              We&apos;ll let you know when Monthly opens.
            </p>
            <p className="font-sans text-sm mb-8" style={{ color: "var(--warm)" }}>
              We&apos;ll email{" "}
              <span style={{ color: "var(--cream)" }}>{email}</span> when the monthly plan
              launches with early access pricing.
            </p>
            <button
              onClick={onClose}
              className="font-sans text-xs tracking-widest uppercase w-full py-3 transition-colors"
              style={{
                border: "1px solid rgba(245,240,232,0.15)",
                color: "var(--cream)",
                background: "transparent",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(245,240,232,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Close
            </button>
          </div>
        ) : (
          /* Form state */
          <>
            <p
              className="font-sans text-xs tracking-[0.25em] uppercase mb-4"
              style={{ color: "var(--gold)" }}
            >
              Monthly Plan — Coming Soon
            </p>
            <p
              className="font-serif font-light mb-2"
              style={{ fontSize: "1.5rem", color: "var(--cream)" }}
            >
              Join the waitlist
            </p>
            <p className="font-sans text-sm mb-8 leading-relaxed" style={{ color: "var(--warm)" }}>
              Be first to access the monthly plan when it launches. Early access members get
              a discounted rate locked in for life.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="font-sans text-sm w-full mb-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderBottom: "1px solid rgba(201,168,76,0.4)",
                  color: "var(--cream)",
                  padding: "0.75rem 1rem",
                  outline: "none",
                  width: "100%",
                }}
              />

              {error && (
                <p className="font-sans text-xs mb-3" style={{ color: "var(--rust)" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email.includes("@")}
                className="font-sans text-xs tracking-widest uppercase w-full py-3 transition-all"
                style={{
                  background: loading || !email.includes("@") ? "rgba(201,168,76,0.4)" : "var(--gold)",
                  color: "var(--ink)",
                  border: "none",
                  cursor: loading || !email.includes("@") ? "not-allowed" : "pointer",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  marginBottom: "1rem",
                }}
              >
                {loading ? "Joining…" : "Join the Waitlist →"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="font-sans text-xs w-full py-2 transition-colors"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Cancel
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
