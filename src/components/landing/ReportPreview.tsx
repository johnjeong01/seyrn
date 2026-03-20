"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* Fully visible section */
function FullSection({
  number,
  title,
  content,
  delay = 0,
}: {
  number: string;
  title: string;
  content: string;
  delay?: number;
}) {
  return (
    <div
      className="border-b border-[rgba(255,255,255,0.06)] py-7"
      style={{ opacity: 0, animation: `fadeUp 0.8s ease-out ${delay}s forwards` }}
    >
      <div className="flex items-start gap-5">
        <span
          className="font-serif text-[var(--gold)]/30 font-light shrink-0 mt-0.5"
          style={{ fontSize: "1.75rem", lineHeight: 1 }}
        >
          {number}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-light text-[var(--cream)] mb-3" style={{ fontSize: "1.15rem" }}>
            {title}
          </h4>
          <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
}

/* Gradient-fade section — visible text fades into blur */
function FadeSection({
  number,
  title,
  visibleText,
  hiddenText,
  delay = 0,
}: {
  number: string;
  title: string;
  visibleText: string;
  hiddenText: string;
  delay?: number;
}) {
  return (
    <div
      className="border-b border-[rgba(255,255,255,0.06)] py-7"
      style={{ opacity: 0, animation: `fadeUp 0.8s ease-out ${delay}s forwards` }}
    >
      <div className="flex items-start gap-5">
        <span
          className="font-serif text-[var(--gold)]/30 font-light shrink-0 mt-0.5"
          style={{ fontSize: "1.75rem", lineHeight: 1 }}
        >
          {number}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-light text-[var(--cream)] mb-3" style={{ fontSize: "1.15rem" }}>
            {title}
          </h4>
          <div className="relative">
            <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">
              {visibleText}{" "}
              <span className="blur-[5px] select-none">{hiddenText}</span>
            </p>
            {/* gradient mask over the blurred part */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to right, transparent 35%, var(--deep) 80%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Section with headline + year visible, rest blurred */
function TurningPointSection({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="border-b border-[rgba(255,255,255,0.06)] py-7"
      style={{ opacity: 0, animation: `fadeUp 0.8s ease-out ${delay}s forwards` }}
    >
      <div className="flex items-start gap-5">
        <span
          className="font-serif text-[var(--gold)]/30 font-light shrink-0 mt-0.5"
          style={{ fontSize: "1.75rem", lineHeight: 1 }}
        >
          05
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-light text-[var(--cream)] mb-3" style={{ fontSize: "1.15rem" }}>
            Next Turning Point
          </h4>
          <p className="font-sans text-sm text-[var(--muted)] leading-relaxed mb-2">
            Your next turning point:{" "}
            <span className="text-[var(--gold)] font-medium">2026</span>
          </p>
          <div className="relative overflow-hidden" style={{ height: "3.5rem" }}>
            <p className="font-sans text-sm text-[var(--muted)] leading-relaxed blur-[6px] select-none">
              The nature of this shift involves a professional identity change — not just a job change. The window opens in Q2 and peaks by Q4. Three specific actions will determine whether you capture or miss it.
            </p>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent 0%, var(--deep) 85%)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Headline-only section */
function HeadlineSection({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="py-7"
      style={{ opacity: 0, animation: `fadeUp 0.8s ease-out ${delay}s forwards` }}
    >
      <div className="flex items-start gap-5">
        <span
          className="font-serif text-[var(--gold)]/30 font-light shrink-0 mt-0.5"
          style={{ fontSize: "1.75rem", lineHeight: 1 }}
        >
          06
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-light text-[var(--cream)] mb-1" style={{ fontSize: "1.15rem" }}>
            Strategic Moves
          </h4>
          <p className="font-sans text-sm text-[var(--gold)]/70 leading-relaxed italic">
            &ldquo;Stop reacting. Start positioning.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

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
        {/* Depth indicator */}
        <p
          className="font-sans text-xs text-[var(--muted)]/60 text-center italic mb-10"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease-out 0.2s" }}
        >
          This is a condensed preview. Your actual report is 4× longer with specific dates, named patterns, and a 12-month action plan.
        </p>

        <div className="grid md:grid-cols-[1fr_1.6fr] gap-16 items-start">
          {/* Left: header + CTA */}
          <div className="sticky top-24">
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-4">
              Sample Report — Alex, 37
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
          </div>

          {/* Right: report sections */}
          <div
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease-out" }}
          >
            <FullSection
              number="01"
              title="Energy Cycle Pattern"
              content="Your energy peaks approximately every 22 months. The clearest peak appeared at ages 28 and 35 — both preceded by a 6-month contraction phase. You're currently 4 months from a natural high."
              delay={visible ? 0.1 : 0}
            />

            <FullSection
              number="02"
              title="Relationship Pattern"
              content="Every major breakthrough in your data involved a mentor figure. Without exception, your lowest-energy periods correlate with working in isolation. The pattern is structural, not coincidental."
              delay={visible ? 0.2 : 0}
            />

            <FadeSection
              number="03"
              title="Recurring Themes"
              visibleText="Three forces have quietly run your life:"
              hiddenText="autonomy, proximity to ambition, and a recurring need to rebuild from scratch. Each one has served you — and each one has cost you. The third force is the one most likely to determine the next five years."
              delay={visible ? 0.3 : 0}
            />

            <FadeSection
              number="04"
              title="Emotional Signature — The Controlled Burn"
              visibleText="Your dominant emotional pattern is not what most people would expect —"
              hiddenText="it's a slow, deliberate suppression that creates enormous forward momentum, then releases all at once. You've done this four times. Each release reshaped your direction entirely."
              delay={visible ? 0.4 : 0}
            />

            <TurningPointSection delay={visible ? 0.5 : 0} />

            <HeadlineSection delay={visible ? 0.6 : 0} />
          </div>
        </div>

        {/* Pull quote */}
        <div
          className="mt-20 max-w-2xl mx-auto text-center"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease-out 0.8s" }}
        >
          <div
            className="w-px h-12 mx-auto mb-8"
            style={{ background: "linear-gradient(to bottom, transparent, var(--gold)/40)" }}
          />
          <blockquote
            className="font-serif font-light italic text-[var(--cream)] leading-relaxed mb-6"
            style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)" }}
          >
            &ldquo;You have been applying maximum effort inside a system that wasn&apos;t designed to reward you. What you&apos;ve been missing is not discipline &mdash; it&apos;s leverage.&rdquo;
          </blockquote>
          <p className="font-sans text-xs text-[var(--muted)]/60 tracking-wide">
            — From an actual Seyrn report
          </p>
        </div>
      </div>
    </section>
  );
}
