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
    <p className="font-sans text-sm text-[var(--muted)] leading-[1.85]">
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
      <p className="font-sans text-sm text-[var(--muted)] leading-[1.8]">{body}</p>
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
      <p className="font-sans text-sm text-[var(--muted)] leading-[1.8]">{text}</p>
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
          <p className="font-sans text-sm text-[var(--muted)] leading-relaxed max-w-lg mx-auto">
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
        <Section number="01" title="You peak every 22 months — and you&apos;re almost there." delay={0.1} visible={visible}>
          <Body>
            Your energy peaks approximately every 22 months. The clearest peaks appeared at ages 28 and 35 — both preceded by a 6-month contraction phase where you pulled back, reassessed, and rebuilt momentum quietly.
            <br /><br />
            You are currently in a contraction phase. Based on your cycle, you are approximately 4 months from your next natural high. This is not stagnation — it is loading.
            <br /><br />
            The mistake most people make at this point in the cycle is forcing acceleration. Your data says the opposite: protect your energy now, and the peak arrives on schedule.
          </Body>
        </Section>

        {/* Section 02 */}
        <Section number="02" title="You grow through people — but only the right kind." delay={0.2} visible={visible}>
          <Body>
            Every major breakthrough in your data involved a mentor or senior figure who believed in you before the evidence was there. Without exception, your lowest-energy periods correlate with working in isolation or with peers at the same level as you.
            <br /><br />
            The pattern is structural, not coincidental. You are not someone who grows alone — you are someone who grows fastest when pulled forward by someone who has already been where you&apos;re going.
            <br /><br />
            The question your data raises: who in your current life fills that role? If the answer is no one, that is the most actionable gap in your pattern right now.
          </Body>
        </Section>

        {/* Section 03 */}
        <Section number="03" title="Three forces that have quietly run your life." delay={0.3} visible={visible}>
          <div className="flex flex-col gap-4">
            <ThemeCard
              title="The Leap Before The Net"
              body="Every major move in your data was made before the conditions were ideal. You have never waited for permission or certainty. This is courage — but it has also meant that your financial foundation resets with each leap instead of compounding."
            />
            <ThemeCard
              title="The Isolation Trap"
              body="When things get hard, you go quiet. You stop reaching out, stop asking for help, and try to solve it alone. Your data shows this extends low-energy periods by an average of 4–6 months longer than necessary."
            />
            <ThemeCard
              title="The Builder&apos;s Identity"
              body="Underneath every turning point is the same drive: to build something that belongs entirely to you. Not a job. Not a role. Something you made. This has been true since age 24 and it has not changed."
            />
          </div>
        </Section>

        {/* Section 04 */}
        <Section number="04" title="The Controlled Burn" delay={0.4} visible={visible}>
          <Body>
            Your dominant emotional pattern is not what most people would expect. You do not panic under pressure — you compress. Fear and excitement arrive together in your data, every single time, without exception.
            <br /><br />
            This pairing is your signature. It means you cannot use the absence of fear as a signal that you&apos;re ready. You will always feel fear at the moment of the right decision. You always have.
            <br /><br />
            The risk in your pattern is not impulsiveness — it is the opposite. When the fear gets loud enough, you sometimes wait too long, and the window closes.
          </Body>
        </Section>

        {/* Section 05 */}
        <Section number="05" title="Your next turning point arrives around 2026." delay={0.5} visible={visible}>
          <div
            className="flex items-center gap-4 mb-6 py-4 px-5"
            style={{
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            <div>
              <p className="font-sans text-xs text-[var(--muted)] tracking-widest uppercase mb-1">Predicted Year</p>
              <p className="font-serif text-[var(--gold)]" style={{ fontSize: "2.5rem", lineHeight: 1 }}>2026</p>
            </div>
            <div className="w-px h-12 bg-[rgba(201,168,76,0.2)]" />
            <div>
              <p className="font-sans text-xs text-[var(--muted)] tracking-widest uppercase mb-2">Energy Forecast</p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.08)]" style={{ width: "100px" }}>
                  <div className="h-full rounded-full bg-[var(--gold)]" style={{ width: "80%" }} />
                </div>
                <span className="font-sans text-xs text-[var(--muted)]">8/10</span>
              </div>
            </div>
          </div>
          <Body>
            Every previous turning point in your life was externally triggered — a move, a failure, an opportunity. Your next one will be different.
            <br /><br />
            It will be the moment you stop trading time for money entirely and begin earning from something you built. Based on your cycle, this window opens in 2026 — but only if the groundwork is laid in the 18 months before it.
            <br /><br />
            The years 2024 and 2025 are preparation years, not pivot years. What you build quietly now determines what becomes visible then.
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
            &ldquo;Your greatest asset is not your talent or your courage — both of which you have in abundance. It is the 18 months ahead of you, if you use them differently than you&apos;ve used every 18 months before.&rdquo;
          </blockquote>
          <div className="flex flex-col gap-5">
            <Move
              number="01"
              text="Define the one thing you are building — in writing, one paragraph. Vague intentions stay vague. A written definition becomes a target your subconscious begins solving for."
            />
            <Move
              number="02"
              text="Identify your next mentor figure. Not a peer. Someone 5–10 years ahead on the path you&apos;re on. Your data is unambiguous: you do not grow at full speed without this person in your orbit."
            />
            <Move
              number="03"
              text="Protect 90 minutes per week of uninterrupted deep focus on your independent income concept. Non-negotiable. Treat it like a meeting you cannot cancel."
            />
            <Move
              number="04"
              text="Stop the financial reset cycle. Before the next leap, build 3 months of operating reserve. Every leap you&apos;ve made was right. The timing was right. The foundation underneath was not."
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
          <p className="font-sans text-sm text-[var(--muted)] leading-[1.85] mb-10 max-w-md mx-auto">
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
