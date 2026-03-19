"use client";

import { useState, useEffect } from "react";

interface Props {
  show: boolean;
  predictedYear?: number;
}

export default function UnlockBanner({ show, predictedYear }: Props) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState<"one-time" | "monthly" | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (!show) return;

    const sentinel = document.getElementById("paywall-start");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [show]);

  if (!show || !visible) return null;

  const yearText = predictedYear ? `around ${predictedYear}` : "soon";

  async function handleCheckout(plan: "one-time" | "monthly") {
    setLoading(plan);
    setCheckoutError(null);
    try {
      // Read email from onboarding data so Stripe metadata has it
      let email: string | undefined;
      try {
        const raw = localStorage.getItem("seyrn-onboarding-data");
        if (raw) email = (JSON.parse(raw) as { email?: string }).email;
      } catch { /* ignore */ }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error ?? "Checkout failed. Please try again.");
        setLoading(null);
      }
    } catch {
      setCheckoutError("Network error. Please try again.");
      setLoading(null);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--deep)",
        borderTop: "2px solid var(--gold)",
        zIndex: 50,
        animation: "fadeUp 0.4s ease-out forwards",
        padding: "1.25rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {/* Left text */}
        <div>
          <p
            className="font-serif font-light"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
              color: "var(--cream)",
              lineHeight: 1.2,
              marginBottom: "0.2rem",
            }}
          >
            Your next turning point is coming.
          </p>
          <p className="font-sans text-xs" style={{ color: "var(--muted)" }}>
            Predicted {yearText} — unlock to see the full forecast
          </p>
        </div>

        {/* Checkout error */}
        {checkoutError && (
          <p
            className="w-full font-sans text-xs text-center sm:text-left"
            style={{ color: "var(--rust)", marginBottom: "0.5rem" }}
          >
            {checkoutError}
          </p>
        )}

        {/* Right CTAs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
            flexShrink: 0,
          }}
          className="w-full sm:w-auto"
        >
          {/* Primary button */}
          <button
            disabled={loading !== null}
            className="font-sans text-xs tracking-widest uppercase transition-all w-full sm:w-auto"
            style={{
              background: loading === "one-time" ? "var(--gold-light)" : "var(--gold)",
              color: "var(--ink)",
              padding: "0.75rem 1.5rem",
              border: "none",
              cursor: loading !== null ? "wait" : "pointer",
              fontWeight: 500,
              letterSpacing: "0.12em",
              whiteSpace: "nowrap",
              opacity: loading !== null && loading !== "one-time" ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = "var(--gold-light)";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = "var(--gold)";
            }}
            onClick={() => handleCheckout("one-time")}
          >
            {loading === "one-time" ? "Loading…" : "Unlock Full Report — $19"}
          </button>

          {/* Secondary link */}
          <button
            disabled={loading !== null}
            className="font-sans text-xs transition-colors"
            style={{
              background: "transparent",
              border: "none",
              cursor: loading !== null ? "wait" : "pointer",
              color: "var(--muted)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              whiteSpace: "nowrap",
              padding: "0.75rem 0",
              opacity: loading !== null && loading !== "monthly" ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.color = "var(--cream)";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.color = "var(--muted)";
            }}
            onClick={() => handleCheckout("monthly")}
          >
            {loading === "monthly" ? "Loading…" : "$9.99/mo"}
          </button>
        </div>
      </div>
    </div>
  );
}
