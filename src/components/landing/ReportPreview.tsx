"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
    <p className="font-sans text-sm text-[var(--warm)] leading-[1.85]">
      {children}
    </p>
  );
}

function ThemeCard({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="p-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
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
          <p className="font-sans text-xs text-[var(--muted)]/60 italic leading-relaxed">
            Based on 5 turning points: career pivot at 24, move abroad at 27, relationship shift at 31, business failure at 34, independent venture at 36.
          </p>
        </div>

        {/* Section 01 */}
        <Section number="01" title="Your best decisions happened when you felt worst." delay={0.1} visible={visible}>
          <Body>
            3 of Alex&apos;s 5 turning points were initiated at an energy level of 5 or below — not during the high-energy peaks most people assume drive change. The career pivot at 24, the business failure at 34, and the independent venture at 36 all began in contraction, not momentum.
            <br /><br />
            The move abroad at 27 and the relationship shift at 31 appear unrelated in the data. They are connected by one detail that doesn&apos;t appear inside either event: both occurred within 14 months of a previous energy peak. The high-energy phases don&apos;t produce change — they create the pressure that makes change inevitable when they end.
            <br /><br />
            The paradox this creates: Alex has spent years waiting for the right conditions to act — stability, clarity, high energy. Every high-stakes decision in the data was made precisely when those conditions were absent. Alex doesn&apos;t launch from comfort. Alex launches from accumulated tension.
          </Body>
          <div
            style={{
              borderLeft: "3px solid var(--gold)",
              background: "rgba(201,168,76,0.04)",
              padding: "0.875rem 1.125rem",
              marginTop: "1.25rem",
            }}
          >
            <p className="font-sans uppercase mb-1.5" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--gold)" }}>Today</p>
            <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--cream)", fontStyle: "italic" }}>
              Write down the decision you&apos;ve been calling &ldquo;not quite ready.&rdquo; Set a 14-day deadline in your calendar for making it — not for it to be ready, but for you to decide.
            </p>
          </div>
        </Section>

        {/* Section 02 */}
        <Section number="02" title="You believe you grow alone. Your data disagrees." delay={0.2} visible={visible}>
          <Body>
            4 of Alex&apos;s 5 positive-outcome turning points share a single structural feature: another person played a specific catalyzing role. The lone exception — the business failure at 34 — is also the only period where Alex had deliberately pulled back from seeking outside input. The correlation is not ambiguous.
            <br /><br />
            The career pivot at 24 and the independent venture at 36 appear unrelated — different industries, different stages of life. They share one overlooked data point: both coincide with the presence of someone who believed in the outcome before the evidence existed. These two points, 12 years apart, are driven by the same structural condition.
            <br /><br />
            The blind spot this creates is significant. Alex&apos;s self-narrative is built around independence. But the periods of highest output — the ones Alex identifies as peaks — are all structurally dependent on a single relationship type. Alex optimizes for going alone precisely when going with someone would accelerate everything.
          </Body>
          <div
            style={{
              borderLeft: "3px solid var(--gold)",
              background: "rgba(201,168,76,0.04)",
              padding: "0.875rem 1.125rem",
              marginTop: "1.25rem",
            }}
          >
            <p className="font-sans uppercase mb-1.5" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--gold)" }}>Today</p>
            <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--cream)", fontStyle: "italic" }}>
              Name the one person currently 5–10 years ahead of you on the path you&apos;re on. If you can&apos;t name anyone, write down exactly how you would find them. Do this before you open anything else today.
            </p>
          </div>
        </Section>

        {/* Section 03 */}
        <Section number="03" title="Three forces that have quietly run your life." delay={0.3} visible={visible}>
          <div className="flex flex-col gap-4">
            <ThemeCard
              title="The Pre-Launch Tension"
              body="Every major move in Alex's data was made before the conditions were ideal. But in 4 of 5 cases, there were 6–12 months of quiet preparation before the visible leap. The leap isn't impulsive — it's just the visible part of a longer, invisible build that Alex rarely credits."
            />
            <ThemeCard
              title="The Isolation Loop"
              body="When pressure increases, Alex's first response is to stop reaching out. Every low-energy period in the data that began with deliberate isolation lasted an average of 5 months longer than it needed to. The loop is self-sealing: isolation creates the conditions that make isolation feel like the only option."
            />
            <ThemeCard
              title="The Builder&apos;s Constant"
              body="Underneath every turning point — career pivot, move, relationship shift, failure, independent venture — the same drive is operating: to build ownership. Not a position. Not security. Something that belongs to Alex entirely. This has been true since age 24 and hasn't weakened once across 13 years."
            />
          </div>
        </Section>

        {/* Section 04 */}
        <Section number="04" title="Fear and forward motion are the same signal in Alex&apos;s system." delay={0.4} visible={visible}>
          <Body>
            In every turning point Alex recorded — all 5, without exception — fear and forward movement appear simultaneously, not sequentially. The data does not show a pattern where fear resolved before action was taken. The action was always taken with the fear still present.
            <br /><br />
            The paradox this creates is structural. Alex has developed a working assumption: feel confident first, then act. But that sequence has never once appeared in the data. Every major move was made in a state of significant emotional ambiguity. The confidence came after. It has always come after.
            <br /><br />
            The blind spot: Alex&apos;s 2 lowest-energy years both coincide with periods reported as emotionally calm. The periods rated highest for meaning and growth carry the highest emotional intensity. Calm is not rest in Alex&apos;s pattern. Calm is disengagement.
          </Body>
          <div
            style={{
              borderLeft: "3px solid var(--gold)",
              background: "rgba(201,168,76,0.04)",
              padding: "0.875rem 1.125rem",
              marginTop: "1.25rem",
            }}
          >
            <p className="font-sans uppercase mb-1.5" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--gold)" }}>Today</p>
            <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--cream)", fontStyle: "italic" }}>
              Find the thing you most want to do that you&apos;re waiting to feel confident about first. Write one sentence describing what it looks like when it&apos;s done. Send that sentence to one person today.
            </p>
          </div>
        </Section>

        {/* Section 05 */}
        <Section number="05" title="The next window opens in 2026 — and it&apos;s already forming." delay={0.5} visible={visible}>
          <div
            className="flex items-center gap-4 mb-6 py-4 px-5"
            style={{
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            <div>
              <p className="font-sans text-xs text-[var(--muted)] tracking-widest uppercase mb-1">Pattern-Based Timeframe</p>
              <p className="font-serif text-[var(--gold)]" style={{ fontSize: "2.5rem", lineHeight: 1 }}>2026</p>
            </div>
            <div className="w-px h-12 bg-[rgba(201,168,76,0.2)]" />
            <div>
              <p className="font-sans text-xs text-[var(--muted)] tracking-widest uppercase mb-2">Based on</p>
              <p className="font-sans text-sm" style={{ color: "var(--cream)" }}>24-month cycle · 5 turning points</p>
            </div>
          </div>
          <Body>
            Based on the average interval across all 5 turning points, Alex&apos;s cycle produces a major pivot roughly every 24 months. The last significant turning point — the independent venture — was initiated at 36. The pattern interval places the next window at 38, which lands in 2026.
            <br /><br />
            What distinguishes this pivot from the previous four: every prior turning point was externally triggered — a relationship ended, a company failed, a geography changed. The independent venture at 36 was the first self-initiated move. The 2026 window is the first one where Alex has the data to prepare before it arrives — not react to it after.
            <br /><br />
            The 18 months before each of Alex&apos;s turning points consistently feature a quiet-build phase only visible in retrospect. What gets built in that window is what becomes visible after the pivot. That quiet build is happening right now.
          </Body>
        </Section>

        {/* Section 06 */}
        <Section number="06" title="Stop reacting. Start positioning." delay={0.6} visible={visible}>
          <blockquote
            className="font-serif font-light italic text-[var(--cream)] mb-8 pl-4"
            style={{
              fontSize: "1.1rem",
              borderLeft: "2px solid rgba(201,168,76,0.4)",
              lineHeight: 1.7,
            }}
          >
            &ldquo;Every previous turning point arrived as something that happened to Alex. The next one is the first that could arrive as something Alex built toward.&rdquo;
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

        {/* Transition + CTA */}
        <div
          className="pt-16 pb-4 text-center"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease-out 0.8s" }}
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
          <p className="font-sans text-sm text-[var(--warm)] leading-[1.85] mb-10 max-w-md mx-auto">
            Every insight above references Alex&apos;s specific turning points — specific years, specific people, specific decisions.
            <br /><br />
            Your report references yours. Same depth. Entirely different analysis. Built from what you&apos;ve actually lived.
          </p>
          <Link
            href="/onboarding"
            className="inline-block w-full max-w-sm text-center py-4 bg-[var(--gold)] text-[var(--ink)] font-sans font-medium text-sm tracking-widest uppercase hover:bg-[var(--gold-light)] transition-colors duration-400"
          >
            Discover Your Pattern — $19
          </Link>
          <p className="font-sans text-xs text-[var(--muted)]/50 mt-4">
            10-minute input. Instant analysis. No account required to start.
          </p>
        </div>

      </div>
    </section>
  );
}
