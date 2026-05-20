"use client";

import { useState, useEffect } from "react";

interface Props {
  show: boolean;
  reportId: string | null;
}

export default function UnlockBanner({ show, reportId }: Props) {
  const [visible,       setVisible]       = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (!show) return;
    const sentinel = document.getElementById("paywall-start");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [show]);

  if (!show || !visible) return null;

  async function handleCheckout() {
    if (!reportId) {
      setCheckoutError("Report is still loading. Please wait a moment and try again.");
      return;
    }
    setLoading(true);
    setCheckoutError(null);
    try {
      let email: string | undefined;
      let firstName: string | undefined;
      try {
        const raw = localStorage.getItem("seyrn-onboarding-data");
        if (raw) {
          const parsed = JSON.parse(raw) as { email?: string; firstName?: string };
          email     = parsed.email;
          firstName = parsed.firstName;
        }
      } catch { /* ignore */ }

      const res  = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ reportId, email, firstName }),
      });
      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setCheckoutError(data.error ?? "Checkout failed. Please try again.");
        setLoading(false);
      }
    } catch {
      setCheckoutError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position:   "fixed",
        bottom:     0,
        left:       0,
        right:      0,
        background: "var(--deep)",
        borderTop:  "2px solid var(--gold)",
        zIndex:     50,
        animation:  "fadeUp 0.4s ease-out forwards",
        padding:    "1.25rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth:       "64rem",
          margin:         "0 auto",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          gap:            "1.5rem",
          flexWrap:       "wrap",
        }}
      >
        <div>
          <p
            className="font-serif font-light"
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", color: "var(--cream)", lineHeight: 1.2, marginBottom: "0.2rem" }}
          >
            Your pattern reveals what you can&apos;t see yet.
          </p>
          <p className="font-sans text-xs" style={{ color: "var(--muted)" }}>
            Unlock the full analysis — and what it means for today
          </p>
        </div>

        {checkoutError && (
          <p className="w-full font-sans text-xs text-center sm:text-left" style={{ color: "var(--rust)", marginBottom: "0.5rem" }}>
            {checkoutError}
          </p>
        )}

        <div className="w-full sm:w-auto">
          <button
            disabled={loading}
            className="font-sans text-xs tracking-widest uppercase transition-all w-full sm:w-auto"
            style={{
              background:    loading ? "var(--gold-light)" : "var(--gold)",
              color:         "var(--ink)",
              padding:       "0.75rem 1.5rem",
              border:        "none",
              cursor:        loading ? "wait" : "pointer",
              fontWeight:    500,
              letterSpacing: "0.12em",
              whiteSpace:    "nowrap",
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--gold-light)"; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--gold)"; }}
            onClick={handleCheckout}
          >
            {loading ? "Loading…" : "Unlock Full Report — $19"}
          </button>
        </div>
      </div>
    </div>
  );
}
