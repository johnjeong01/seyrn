"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    Paddle?: {
      Initialize: (config: { token: string }) => void;
      Checkout: {
        open: (params: {
          transactionId: string;
          settings?: { successUrl?: string };
        }) => void;
      };
    };
  }
}

interface Props {
  show: boolean;
  reportId: string | null;
}

export default function UnlockBanner({ show, reportId }: Props) {
  const [visible,          setVisible]          = useState(false);
  const [loading,          setLoading]          = useState(false);
  const [checkoutError,    setCheckoutError]    = useState<string | null>(null);
  const [promoCode,        setPromoCode]        = useState<string | null>(null);
  const [alreadyRedeemed,  setAlreadyRedeemed]  = useState(false);

  // Visibility sentinel observer
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

  // Load Paddle.js and initialize once
  useEffect(() => {
    if (!show) return;
    if (window.Paddle) return;

    const script  = document.createElement("script");
    script.src    = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async  = true;
    script.onload = () => {
      window.Paddle?.Initialize({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
      });
    };
    document.head.appendChild(script);
  }, [show]);

  // Read promo code stored by landing page banner
  useEffect(() => {
    try {
      const stored = localStorage.getItem("seyrn-promo");
      if (stored) setPromoCode(stored);
    } catch { /* ignore */ }
  }, []);

  if (!show || !visible) return null;

  async function handleCheckout(overridePromo?: string | null) {
    if (!reportId) {
      setCheckoutError("Report is still loading. Please wait a moment and try again.");
      return;
    }
    setLoading(true);
    setCheckoutError(null);

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

    const activePromo = overridePromo === null ? null : (overridePromo ?? promoCode);

    try {
      const res  = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ reportId, email, firstName, discountCode: activePromo }),
      });
      const data = (await res.json()) as {
        transactionId?: string;
        successUrl?: string;
        error?: string;
      };

      if (res.status === 409 && data.error === "already_redeemed") {
        setAlreadyRedeemed(true);
        setCheckoutError(
          "Looks like you've already claimed your free report with this email."
        );
        setLoading(false);
        return;
      }

      if (data.transactionId && window.Paddle) {
        window.Paddle.Checkout.open({
          transactionId: data.transactionId,
          settings: { successUrl: data.successUrl },
        });
        setLoading(false);
      } else if (!window.Paddle) {
        setCheckoutError("Payment system not loaded. Please refresh and try again.");
        setLoading(false);
      } else {
        setCheckoutError(data.error ?? "Checkout failed. Please try again.");
        setLoading(false);
      }
    } catch {
      setCheckoutError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const isPromo = promoCode && !alreadyRedeemed;

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
          {isPromo ? (
            <>
              <p
                className="font-serif font-light"
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", color: "var(--cream)", lineHeight: 1.2, marginBottom: "0.2rem" }}
              >
                Your free report is ready.
              </p>
              <p className="font-sans text-xs" style={{ color: "var(--gold)" }}>
                Launch offer applied — no payment required
              </p>
            </>
          ) : (
            <>
              <p
                className="font-serif font-light"
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", color: "var(--cream)", lineHeight: 1.2, marginBottom: "0.2rem" }}
              >
                Your pattern reveals what you can&apos;t see yet.
              </p>
              <p className="font-sans text-xs" style={{ color: "var(--muted)" }}>
                Unlock the full analysis — and what it means for today
              </p>
            </>
          )}
        </div>

        {checkoutError && (
          <p className="w-full font-sans text-xs text-center sm:text-left" style={{ color: alreadyRedeemed ? "var(--muted)" : "var(--rust)", marginBottom: "0.25rem" }}>
            {checkoutError}
          </p>
        )}

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-center">
          {/* Primary button */}
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
            onClick={() => handleCheckout(alreadyRedeemed ? null : undefined)}
          >
            {loading
              ? "Loading…"
              : isPromo
              ? "Claim Free Report"
              : "Unlock Full Report — $19"}
          </button>

          {/* If already redeemed, offer paid path */}
          {alreadyRedeemed && (
            <button
              disabled={loading}
              className="font-sans text-xs tracking-widest uppercase transition-all w-full sm:w-auto"
              style={{
                background:    "transparent",
                color:         "var(--muted)",
                padding:       "0.75rem 1.5rem",
                border:        "1px solid rgba(122,114,104,0.4)",
                cursor:        "pointer",
                fontWeight:    400,
                letterSpacing: "0.12em",
                whiteSpace:    "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(122,114,104,0.4)"; e.currentTarget.style.color = "var(--muted)"; }}
              onClick={() => handleCheckout(null)}
            >
              Unlock for $19
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
