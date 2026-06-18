"use client";

import Link from "next/link";

const PROMO_CODE = "LAUNCH200";

export default function PromoBanner() {
  function storePromo() {
    try { localStorage.setItem("seyrn-promo", PROMO_CODE); } catch { /* ignore */ }
  }

  return (
    <div
      style={{
        background:     "var(--gold)",
        padding:        "0.55rem 1.5rem",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        gap:            "1.25rem",
        flexWrap:       "wrap",
      }}
    >
      <p
        className="font-sans text-xs font-medium tracking-wide text-center"
        style={{ color: "var(--ink)" }}
      >
        Launch offer · First 200 users get full access free — no credit card required.
      </p>
      <Link
        href="/onboarding"
        onClick={storePromo}
        className="font-sans text-xs font-semibold tracking-widest uppercase whitespace-nowrap"
        style={{
          color:          "var(--ink)",
          border:         "1.5px solid var(--ink)",
          padding:        "0.3rem 0.85rem",
          transition:     "background 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--ink)";
          e.currentTarget.style.color      = "var(--gold)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color      = "var(--ink)";
        }}
      >
        Claim Free Access →
      </Link>
    </div>
  );
}
