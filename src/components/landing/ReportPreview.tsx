"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* Individual report section card */
function ReportSection({
  number,
  title,
  preview,
  locked,
  delay = 0,
}: {
  number: string;
  title: string;
  preview: string;
  locked: boolean;
  delay?: number;
}) {
  return (
    <div
      className="relative border-b border-[rgba(255,255,255,0.06)] py-7 px-0 group"
      style={{ opacity: 0, animation: `fadeUp 0.8s ease-out ${delay}s forwards` }}
    >
      <div className="flex items-start gap-5">
        {/* Number */}
        <span
          className="font-serif text-[var(--gold)]/30 font-light shrink-0 mt-0.5"
          style={{ fontSize: "1.75rem", lineHeight: 1 }}
        >
          {number}
        </span>

        <div className="flex-1 min-w-0">
          {/* Section title */}
          <h4
            className="font-serif font-light text-[var(--cream)] mb-3"
            style={{ fontSize: "1.15rem" }}
          >
            {title}
          </h4>

          {/* Content — locked or visible */}
          {locked ? (
            <div className="relative">
              <p className="font-sans text-sm text-[var(--muted)] leading-relaxed blur-[6px] select-none">
                {preview}
              </p>
              <div className="absolute inset-0 flex items-center justify-start">
                <span className="flex items-center gap-2 font-sans text-xs text-[var(--gold)]/60 tracking-wide">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="3" y="6" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M5 6V4.5a2 2 0 0 1 4 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  Unlocks with full report
                </span>
              </div>
            </div>
          ) : (
            <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">
              {preview}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const sections = [
  {
    number: "01",
    title: "Energy Cycle Pattern",
    preview: "Your energy peaks approximately every 22 months. The clearest peak appeared at ages 28 and 35 — both preceded by a 6-month contraction phase. Your current position suggests you're 4 months from a natural high.",
    locked: false,
  },
  {
    number: "02",
    title: "Relationship Pattern",
    preview: "Every major breakthrough in your data involved a mentor figure. Without exception, your lowest-energy periods correlate with working in isolation. The pattern is structural, not coincidental.",
    locked: false,
  },
  {
    number: "03",
    title: "Recurring Risk Pattern",
    preview: "There is a specific type of opportunity you consistently over-commit to at the wrong moment in your cycle. It has appeared three times. Each time, the result was a 14-to-18 month setback.",
    locked: true,
  },
  {
    number: "04",
    title: "Emotional Signature",
    preview: "Your dominant pre-breakthrough emotion is not excitement — it's a specific, quiet anxiety that you've historically misread as a warning sign. It is a signal to move, not stop.",
    locked: true,
  },
  {
    number: "05",
    title: "Next Turning Point",
    preview: "Based on your cycle timing and current season, the next major turning point is projected for Q3 2025. The nature of the shift will involve a professional identity change — not just a job change.",
    locked: true,
  },
  {
    number: "06",
    title: "The One Thing to Do Now",
    preview: "Stop treating your current plateau as failure. Based on your data, this contraction phase is load-bearing. The one action that consistently accelerates your transitions is...",
    locked: true,
  },
];

export default function ReportPreview() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-section"
      style={{ background: "var(--ink)" }}
      id="report"
    >
      <div className="divider-gold w-full absolute top-0" />

      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-[1fr_1.6fr] gap-16 items-start">
          {/* Left: header + CTA */}
          <div className="sticky top-24">
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-4">
              Sample Report
            </p>
            <h2
              className="font-serif font-light text-[var(--cream)] mb-6"
              style={{ fontSize: "clamp(2rem,4vw,3rem)" }}
            >
              Sharp.
              <br />
              Specific.
              <br />
              <em className="italic text-[var(--gold)]">Yours.</em>
            </h2>
            <p className="font-sans font-light text-[var(--muted)] text-sm leading-relaxed mb-10">
              Not generic life advice. Every insight references your actual turning points — specific years, specific patterns.
            </p>

            {/* Free badge */}
            <div className="flex items-center gap-2 mb-6">
              <span
                className="font-sans text-xs px-3 py-1 border border-[var(--sage)]/50 text-[var(--sage)] tracking-wide"
              >
                Free
              </span>
              <span className="font-sans text-xs text-[var(--muted)]">Sections 1–2 visible</span>
            </div>

            {/* Paywall nudge */}
            <div
              className="p-6 mb-8"
              style={{
                background: "rgba(201,168,76,0.04)",
                border: "1px solid rgba(201,168,76,0.15)",
              }}
            >
              <p className="font-serif font-light text-[var(--cream)] text-lg mb-1">
                Your next turning point is coming.
              </p>
              <p className="font-sans text-sm text-[var(--muted)] mb-4">
                Are you going to be ready this time?
              </p>
              <Link
                href="/onboarding"
                className="inline-block w-full text-center py-3 bg-[var(--gold)] text-[var(--ink)] font-sans font-medium text-sm tracking-widest uppercase hover:bg-[var(--gold-light)] transition-colors duration-400"
              >
                Unlock Full Report — $19
              </Link>
            </div>

            <p className="font-sans text-xs text-[var(--muted)]/60 text-center">
              or get everything, ongoing →{" "}
              <Link href="#pricing" className="text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors">
                $9.99 / month
              </Link>
            </p>
          </div>

          {/* Right: report sections */}
          <div
            className="relative"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease-out" }}
          >
            {sections.map((s, i) => (
              <ReportSection
                key={i}
                {...s}
                delay={visible ? i * 0.1 : 0}
              />
            ))}

            {/* Fade-out blur at bottom for locked sections */}
            <div
              className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, var(--ink) 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
