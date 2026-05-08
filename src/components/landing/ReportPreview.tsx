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

function ThemeCard({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="p-5"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <p className="font-serif text-[var(--cream)] mb-3" style={{ fontSize: "1rem" }}>
        {title}
      </p>
      <p className="font-sans text-sm text-[var(--warm)] leading-[1.8]">{body}</p>
    </div>
  );
}

function Move({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex gap-4">
      <span
        className="font-serif text-[var(--gold)]/40 shrink-0 mt-0.5"
        style={{ fontSize: "1.1rem", lineHeight: 1.4 }}
      >
        {number}
      </span>
      <p className="font-sans text-sm text-[var(--warm)] leading-[1.8]">{text}</p>
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

        {/* Section 03 — Recurring Themes */}
        <Section
          number="03"
          title="Three forces that have quietly run your life."
          delay={0.3}
          visible={visible}
        >
          <div className="flex flex-col gap-4">
            <ThemeCard
              title="The Pre-Launch Tension"
              body="Every major move in Alex's data was made before conditions were ideal. But in 4 of 5 cases, there were 6–12 months of quiet preparation before the visible leap. The leap isn't impulsive — it's just the visible part of a longer, invisible build that Alex rarely credits."
            />
            <ThemeCard
              title="The Isolation Loop"
              body="When pressure increases, Alex's first response is to stop reaching out. Every low-energy period that began with deliberate isolation lasted an average of 5 months longer than it needed to. The loop is self-sealing: isolation creates the conditions that make isolation feel like the only option."
            />
            <ThemeCard
              title="The Builder's Constant"
              body="Underneath every turning point — career pivot, move, relationship shift, failure, independent venture — the same drive is operating: to build ownership. Not a position. Not security. Something that belongs to Alex entirely. This has been true since age 24."
            />
          </div>
        </Section>

        {/* Section 04 — Emotional Signature */}
        <Section
          number="04"
          title="Fear and forward motion are the same signal in Alex's system."
          delay={0.4}
          visible={visible}
        >
          <Body>
            In every turning point Alex recorded — all 5, without exception — fear and forward
            movement appear simultaneously, not sequentially. The data does not show a pattern
            where fear resolved before action was taken. The action was always taken with the
            fear still present.
          </Body>
          <Body>
            The paradox this creates is structural. Alex has developed a working assumption: feel
            confident first, then act. But that sequence has never once appeared in the data. Every
            major move was made in a state of significant emotional ambiguity. The confidence came
            after. It has always come after.
          </Body>
          <Body>
            The blind spot: Alex&apos;s 2 lowest-energy years both coincide with periods reported
            as emotionally calm. The periods rated highest for meaning and growth carry the highest
            emotional intensity. Calm is not rest in Alex&apos;s pattern. Calm is disengagement.
          </Body>
          <Today>
            Find the thing you most want to do that you&apos;re waiting to feel confident about
            first. Write one sentence describing what it looks like when it&apos;s done. Send that
            sentence to one person today.
          </Today>
        </Section>

        {/* Section 05 — Next Turning Point */}
        <Section
          number="05"
          title="The next window opens in 2026 — and it's already forming."
          delay={0.5}
          visible={visible}
        >
          <div
            className="flex items-center gap-4 mb-6 py-4 px-5"
            style={{
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            <div>
              <p className="font-sans text-xs text-[var(--muted)] tracking-widest uppercase mb-1">
                Pattern-Based Timeframe
              </p>
              <p className="font-serif text-[var(--gold)]" style={{ fontSize: "2.5rem", lineHeight: 1 }}>
                2026
              </p>
            </div>
            <div className="w-px h-12 bg-[rgba(201,168,76,0.2)]" />
            <div>
              <p className="font-sans text-xs text-[var(--muted)] tracking-widest uppercase mb-2">
                Based on
              </p>
              <p className="font-sans text-sm" style={{ color: "var(--cream)" }}>
                24-month cycle · 5 turning points
              </p>
            </div>
          </div>
          <Body>
            Based on the average interval across all 5 turning points, Alex&apos;s cycle produces
            a major pivot roughly every 24 months. The last significant turning point — the
            independent venture — was initiated at 36. The pattern interval places the next window
            at 38, which lands in 2026.
          </Body>
          <Body>
            What distinguishes this pivot from the previous four: every prior turning point was
            externally triggered — a relationship ended, a company failed, a geography changed.
            The independent venture at 36 was the first self-initiated move. The 2026 window is
            the first one where Alex has the data to prepare before it arrives.
          </Body>
          <Body>
            The 18 months before each of Alex&apos;s turning points consistently feature a
            quiet-build phase only visible in retrospect. What gets built in that window is what
            becomes visible after the pivot. That quiet build is happening right now.
          </Body>
        </Section>

        {/* Section 06 — Strategic Moves */}
        <Section
          number="06"
          title="Stop reacting. Start positioning."
          delay={0.6}
          visible={visible}
        >
          <blockquote
            className="font-serif font-light italic text-[var(--cream)] mb-8 pl-4"
            style={{ fontSize: "1.1rem", borderLeft: "2px solid rgba(201,168,76,0.4)", lineHeight: 1.7 }}
          >
            &ldquo;Every previous turning point arrived as something that happened to Alex. The next
            one is the first that could arrive as something Alex built toward.&rdquo;
          </blockquote>
          <div className="flex flex-col gap-5">
            <Move
              number="01"
              text="Write one sentence defining what you are building — specifically, what you will own when it's done. Not 'a business' or 'a career.' The specific thing. Do it before you close this tab."
            />
            <Move
              number="02"
              text="Name the one person currently 5–10 years ahead of you on the exact path you're on. Block 30 minutes this week to reach out to them — not to ask for anything, but to introduce yourself and say what you're building."
            />
            <Move
              number="03"
              text="Open your bank account today. Calculate how many months you could operate at current spending if income stopped tomorrow. Write that number down. It determines the timing of your next leap."
            />
            <Move
              number="04"
              text="Block 90 minutes this week — not this month — for uninterrupted work on your independent asset. Put it in your calendar now, before you close this tab. Name it something that makes it non-negotiable."
            />
          </div>
        </Section>

        {/* Daily Insight Sample */}
        <div
          className="mt-16"
          style={{
            opacity: 0,
            animation: visible ? `fadeUp 0.8s ease-out 0.7s forwards` : "none",
          }}
        >
          <div className="text-center mb-8">
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-3">
              What Subscribers Receive Daily
            </p>
            <p className="font-sans text-xs italic" style={{ color: "var(--muted)" }}>
              Alex has been a subscriber for 34 days.
              This is what arrived in his inbox this morning.
            </p>
          </div>
          <DailyInsightSample name="Alex" />
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
