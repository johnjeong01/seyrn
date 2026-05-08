"use client";

import Link from "next/link";
import type { ReportData } from "@/lib/report-types";
import ReportSections from "@/app/report/ReportSections";

export default function SharedReportView({ report }: { report: ReportData }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 pb-32">
      <div className="mb-16" style={{ animation: "fadeUp 0.6s ease-out forwards" }}>
        <p
          className="font-sans text-xs tracking-[0.2em] uppercase mb-2"
          style={{ color: "var(--gold)" }}
        >
          Seyrn · Life Pattern Report
        </p>
        <p className="font-sans text-xs" style={{ color: "var(--muted)" }}>
          You&apos;re viewing a shared pattern. Every pattern is unique.
        </p>
      </div>

      <div className="divider-gold mb-16" />

      <ReportSections
        report={report}
        isPaid={true}
        plan={null}
        turningPoints={[]}
        shareMode={true}
      />

      {/* Discover CTA */}
      <div
        style={{
          background: "#1f1d19",
          marginTop: "4rem",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          padding: "5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "520px", margin: "0 auto" }}>
          <p
            className="font-sans text-xs tracking-[0.25em] uppercase mb-5"
            style={{ color: "var(--gold)" }}
          >
            Your Pattern Is Different
          </p>
          <h2
            className="font-serif font-light mb-6"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "var(--cream)",
              lineHeight: 1.15,
            }}
          >
            No two patterns are alike.
          </h2>
          <p
            className="font-sans font-light text-sm leading-relaxed mb-8"
            style={{ color: "var(--warm)" }}
          >
            10 minutes. Your turning points. Your own pattern revealed.
          </p>
          <Link
            href="/onboarding"
            style={{
              display: "inline-block",
              background: "var(--gold)",
              color: "var(--ink)",
              fontFamily: "inherit",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.9rem 2.5rem",
              textDecoration: "none",
            }}
          >
            Discover Your Pattern →
          </Link>
          <p className="font-sans text-xs mt-4" style={{ color: "var(--muted)" }}>
            Free to start · No account required
          </p>
        </div>
      </div>
    </div>
  );
}
