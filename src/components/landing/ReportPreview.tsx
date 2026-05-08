"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DailyInsightSample from "@/components/report/DailyInsightSample";

function useVisible(threshold = 0.1) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Section({
  number,
  title,
  children,
  delay = 0,
  visible,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  delay?: number;
  visible: boolean;
}) {
  return (
    <div
      className="border-b border-[rgba(255,255,255,0.06)] py-10"
      style={{
        opacity: 0,
        animation: visible ? `fadeUp 0.8s ease-out ${delay}s forwards` : "none",
      }}
    >
      <div className="flex items-baseline gap-4 mb-5">
        <span
          className="font-serif text-[var(--gold)]/25 font-light shrink-0"
          style={{ fontSize: "1.5rem", lineHeight: 1 }}
        >
          {number}
        </span>
        <h4
          className="font-serif font-light text-[var(--cream)]"
          style={{ fontSize: "1.3rem" }}
        >
          {title}
        </h4>
      </div>
      {children}
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-sm text-[var(--warm)] leading-[1.85] mb-4">
      {children}
    </p>
  );
}

function Today({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderLeft: "3px solid var(--gold)",
        background: "rgba(201,168,76,0.04)",
        padding: "0.875rem 1.125rem",
        marginTop: "1.25rem",
      }}
    >
      <p
        className="font-sans uppercase mb-1.5"
        style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--gold)" }}
      >
        What This Means Today
      </p>
      <p
        className="font-sans text-sm leading-relaxed"
        style={{ color: "var(--cream)", fontStyle: "italic" }}
      >
        {children}
      </p>
    </div>
  );
}

function TeasedSection({
  number,
  title,
  firstLine,
  delay = 0,
  visible,
  special,
}: {
  number: string;
  title: string;
  firstLine: React.ReactNode;
  delay?: number;
  visible: boolean;
  special?: React.ReactNode;
}) {
  return (
    <div
      className="border-b border-[rgba(255,255,255,0.06)] py-10"
      style={{
        opacity: 0,
        animation: visible ? `fadeUp 0.8s ease-out ${delay}s forwards` : "none",
      }}
    >
      <div className="flex items-baseline gap-4 mb-5">
        <span
          className="font-serif text-[var(--gold)]/25 font-light shrink-0"
          style={{ fontSize: "1.5rem", lineHeight: 1 }}
        >
          {number}
        </span>
        <h4
          className="font-serif font-light text-[var(--cream)]"
          style={{ fontSize: "1.3rem" }}
        >
          {title}
        </h4>
      </div>
      {special}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <p className="font-sans text-sm text-[var(--warm)] leading-[1.85] mb-3">{firstLine}</p>
        <div
          style={{
            filter: "blur(4px)",
            opacity: 0.35,
            userSelect: "none",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <p className="font-sans text-sm text-[var(--warm)] leading-[1.85] mb-3">
            This pattern has repeated in Alex&apos;s data across every major transition — visible only
            when the full sequence of turning points is mapped together in a single view.
          </p>
          <p className="font-sans text-sm text-[var(--warm)] leading-[1.85]">
            What makes it significant is not its presence but its timing. It activates 6–12 months
            before every visible leap — silently, without Alex noticing it was happening.
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "5rem",
            background: "linear-gradient(to bottom, transparent, var(--ink))",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

export default function ReportPreview() {
  const { ref, visible } = useVisible(0.05);

  return (
    <section
      ref={ref}
      className="relative py-section"
      style={{ background: "var(--ink)" }}
      id="report"
    >
      <div className="divider-gold w-full absolute top-0" />

      <div className="max-w-2xl mx-auto px-6">

        {/* Section header */}
        <div
          className="text-center mb-12"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease-out" }}
        >
          <p className="font-sans text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-4">
            Sample Report
          </p>
          <h2
            className="font-serif font-light text-[var(--cream)] mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
          >
            Sharp. Specific. <em className="italic text-[var(--gold)]">Yours.</em>
          </h2>
          <p className="font-sans text-sm text-[var(--warm)] leading-relaxed max-w-lg mx-auto">
            Every insight references specific turning points — specific years, specific patterns.
            Below is a real sample analysis for Alex, 37.
          </p>
        </div>

        {/* Persona context */}
        <div
          className="mb-4 pb-6 border-b border-[rgba(255,255,255,0.06)]"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease-out 0.15s" }}
        >
          <p className="font-sans text-xs text-[var(--muted)]/60 italic leading-relaxed mb-2">
            Based on 5 turning points: career pivot at 24, move abroad at 27, relationship shift at 31, business failure at 34, independent venture at 36.
          </p>
          <p className="font-sans text-xs italic leading-relaxed" style={{ color: "var(--gold)" }}>
            Every insight below is something Alex could not have seen himself.
          </p>
        </div>

        {/* Section 01 — Energy Cycle */}
        <Section
          number="01"
          title="Alex peaks every 22 months — and always from a low starting point."
          delay={0.1}
          visible={visible}
        >
          <Body>
            5 of Alex&apos;s 6 turning points began at energy 4 or 5 out of 10. Not 7. Not 8.
            His system activates under constraint, not comfort.
          </Body>
          <Body>
            The one time he felt fully settled — age 31, stable job, new city — was the only
            period categorized as stagnation. His data suggests comfort is not a reward.
            It is a warning signal.
          </Body>
          <Body>
            He is currently 4 months from his next natural peak. The low he is in now is not
            failure. It is loading.
          </Body>
          <Today>
            Write down the one thing you are waiting to feel ready for. Your data suggests you
            never will. And that you&apos;ll do it anyway.
          </Today>
        </Section>

        {/* Section 02 — Relationship Pattern */}
        <Section
          number="02"
          title="Every breakthrough involved friction. Every stagnation involved comfort."
          delay={0.2}
          visible={visible}
        >
          <Body>
            Every person who accelerated Alex&apos;s growth gave him uncomfortable feedback.
            Not encouragement — challenge.
          </Body>
          <Body>
            Every person who only validated him appears beside a period of stagnation in his
            record. This is not coincidence. It is a structural feature of how he grows.
          </Body>
          <Body>
            He does not need more support. He needs one person willing to tell him what he
            is avoiding.
          </Body>
          <Today>
            Name one person in your life who tells you hard truths. If no one comes to mind
            immediately, that is the most important data point in this report.
          </Today>
        </Section>

        {/* Section 03 — Recurring Themes (teased) */}
        <TeasedSection
          number="03"
          title="Three forces that have quietly run your life."
          firstLine="The first one explains why you work hard and still feel behind."
          delay={0.3}
          visible={visible}
        />

        {/* Section 04 — Emotional Signature (teased) */}
        <TeasedSection
          number="04"
          title="The Controlled Burn"
          firstLine={
            <>
              Alex&apos;s strongest emotional state is not confidence. It is fear paired with a
              clear direction.
            </>
          }
          delay={0.4}
          visible={visible}
        />

        {/* Section 05 — Next Turning Point (teased with year) */}
        <TeasedSection
          number="05"
          title="The next window opens in 2026 — and it&apos;s already forming."
          firstLine="The trigger is already forming."
          delay={0.5}
          visible={visible}
          special={
            <div
              className="flex items-center gap-4 mb-5 py-4 px-5"
              style={{
                background: "rgba(201,168,76,0.06)",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
            >
              <div>
                <p className="font-sans text-xs text-[var(--muted)] tracking-widest uppercase mb-1">
                  Next Turning Point
                </p>
                <p
                  className="font-serif text-[var(--gold)]"
                  style={{ fontSize: "2.5rem", lineHeight: 1 }}
                >
                  2026
                </p>
              </div>
            </div>
          }
        />

        {/* Section 06 — Strategic Moves (headline only) */}
        <div
          className="border-b border-[rgba(255,255,255,0.06)] py-10"
          style={{
            opacity: 0,
            animation: visible ? `fadeUp 0.8s ease-out 0.6s forwards` : "none",
          }}
        >
          <div className="flex items-baseline gap-4">
            <span
              className="font-serif text-[var(--gold)]/25 font-light shrink-0"
              style={{ fontSize: "1.5rem", lineHeight: 1 }}
            >
              06
            </span>
            <h4
              className="font-serif font-light text-[var(--cream)]"
              style={{ fontSize: "1.3rem" }}
            >
              Stop reacting. Start positioning.
            </h4>
          </div>
        </div>

        {/* Daily Insight Sample */}
        <div
          className="mt-16"
          style={{
            opacity: 0,
            animation: visible ? `fadeUp 0.8s ease-out 0.7s forwards` : "none",
          }}
        >
          <p
            className="font-sans text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-8 text-center"
          >
            What Subscribers Receive Daily
          </p>
          <DailyInsightSample name={null} />
        </div>

        {/* Transition + CTA */}
        <div
          className="pt-16 pb-4 text-center"
          style={{ opacity: 0, animation: visible ? `fadeUp 0.8s ease-out 0.8s forwards` : "none" }}
        >
          <div
            className="w-16 h-px mx-auto mb-12"
            style={{ background: "var(--gold)", opacity: 0.4 }}
          />
          <h3
            className="font-serif font-light text-[var(--cream)] mb-6"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
          >
            This is Alex&apos;s pattern.
            <br />
            <em className="italic text-[var(--gold)]">Yours is different.</em>
          </h3>
          <div className="max-w-[500px] mx-auto mb-10">
            <p className="font-sans text-sm text-[var(--warm)] leading-[1.85] mb-4">
              Every insight above comes from Alex&apos;s specific turning points — specific years,
              specific people, specific decisions.
            </p>
            <p className="font-sans text-sm text-[var(--warm)] leading-[1.85]">
              Your report references yours. Same depth. Entirely different analysis.
              Built from what you&apos;ve actually lived.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="inline-block w-full max-w-sm text-center py-4 bg-[var(--gold)] text-[var(--ink)] font-sans font-medium text-sm tracking-widest uppercase hover:bg-[var(--gold-light)] transition-colors duration-400"
          >
            Discover Your Pattern — $19
          </Link>
          <p className="font-sans text-xs text-[var(--muted)]/50 mt-4">
            10 minutes to complete. Instant analysis. No account required to start.
          </p>
        </div>

      </div>
    </section>
  );
}
