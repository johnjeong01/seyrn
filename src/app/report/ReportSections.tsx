"use client";

import { useState, useEffect, useRef } from "react";
import type { ReportData, PatternSection, ClosingStatement } from "@/lib/report-types";
import type { TurningPoint } from "@/lib/onboarding-types";
import ShareCard from "./ShareCard";

interface Props {
  report: ReportData;
  isPaid: boolean;
  plan: "one-time" | "monthly" | null;
  turningPoints: TurningPoint[];
  currentSeason?: string | null;
  firstName?: string | null;
  shareMode?: boolean;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-sans text-xs tracking-[0.2em] uppercase mb-5"
      style={{ color: "var(--gold)" }}
    >
      {children}
    </p>
  );
}

function SectionHeadline({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-serif font-light mb-6"
      style={{
        fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
        lineHeight: 1.15,
        color: "var(--cream)",
      }}
    >
      {children}
    </h2>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-sans font-light text-sm leading-relaxed mb-4"
      style={{ color: "var(--warm)" }}
    >
      {children}
    </p>
  );
}

function TodayBlock({ content }: { content: string }) {
  return (
    <div
      style={{
        borderLeft: "3px solid var(--gold)",
        background: "rgba(201,168,76,0.04)",
        padding: "1rem 1.25rem",
        marginTop: "1.5rem",
      }}
    >
      <p
        className="font-sans text-[10px] tracking-[0.2em] uppercase mb-2"
        style={{ color: "var(--gold)" }}
      >
        What This Means Today
      </p>
      <p
        className="font-sans text-sm leading-relaxed"
        style={{ color: "var(--cream)", fontStyle: "italic" }}
      >
        {content}
      </p>
    </div>
  );
}

function DataBasis({ content }: { content: string }) {
  return (
    <p
      className="font-sans text-xs leading-relaxed mt-4"
      style={{ color: "rgba(232,223,208,0.5)", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.75rem" }}
    >
      {content}
    </p>
  );
}

function BlurGate({ isPaid, children }: { isPaid: boolean; children: React.ReactNode }) {
  if (isPaid) return <>{children}</>;
  return (
    <div
      style={{
        filter: "blur(10px)",
        pointerEvents: "none",
        userSelect: "none",
        opacity: 0.55,
      }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

function PatternSectionBlock({
  label,
  section,
  isPaid,
}: {
  label: string;
  section: PatternSection;
  isPaid: boolean;
}) {
  return (
    <BlurGate isPaid={isPaid}>
      <SectionLabel>{label}</SectionLabel>
      <SectionHeadline>{section.summary}</SectionHeadline>
      {section.detail.split("\n\n").map((para, i) => (
        <BodyText key={i}>{para}</BodyText>
      ))}
      <DataBasis content={section.data_basis} />
      <TodayBlock content={section.today} />
    </BlurGate>
  );
}

function FreeEnding({ report }: { report: ReportData }) {
  const { sections } = report;
  return (
    <div
      className="mt-12 p-8"
      style={{
        background: "rgba(201,168,76,0.03)",
        border: "1px solid rgba(201,168,76,0.12)",
        borderLeft: "3px solid var(--gold)",
      }}
    >
      <p
        className="font-sans text-xs tracking-[0.2em] uppercase mb-5"
        style={{ color: "var(--rust)" }}
      >
        Pattern Warning
      </p>

      <p
        className="font-sans font-light text-sm leading-relaxed mb-8"
        style={{ color: "var(--warm)" }}
      >
        There is a specific behavior embedded in your pattern — one that has
        reset your progress at every high-energy peak you&apos;ve experienced.
        It doesn&apos;t feel like self-sabotage in the moment. It feels
        reasonable. Your data shows it appearing as{" "}
        <span
          className="font-serif italic"
          style={{ color: "var(--cream)", filter: "blur(5px)", userSelect: "none" }}
        >
          {sections.pattern_warning.summary}
        </span>
        . It has shaped every turning point you&apos;ve recorded.
      </p>

      <div
        className="py-6 my-6"
        style={{
          borderTop: "1px solid rgba(201,168,76,0.12)",
          borderBottom: "1px solid rgba(201,168,76,0.12)",
        }}
      >
        <p
          className="font-sans text-[10px] tracking-[0.3em] uppercase mb-3"
          style={{ color: "var(--muted)" }}
        >
          What the pattern points toward
        </p>
        <p
          className="font-serif font-light"
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            color: "var(--gold)",
            lineHeight: 1.2,
          }}
        >
          {sections.next_turning_point.summary}
        </p>
        <p className="font-sans text-xs mt-2" style={{ color: "var(--muted)" }}>
          {sections.next_turning_point.timeframe} · based on your pattern intervals
        </p>
      </div>

      <p
        className="font-serif font-light text-lg leading-relaxed"
        style={{ color: "var(--cream)", fontStyle: "italic" }}
      >
        Will you recognize it in time — or will you only understand what
        happened after it&apos;s already over?
      </p>
    </div>
  );
}

function WaitlistSection({ firstName: nameProp }: { firstName?: string | null }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState(nameProp ?? "");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("seyrn-onboarding-data");
      if (raw) {
        const parsed = JSON.parse(raw) as { email?: string; firstName?: string };
        if (parsed.email) {
          setEmail(parsed.email);
          setPrefilled(true);
        }
        if (parsed.firstName && !nameProp) setFirstName(parsed.firstName);
      }
    } catch { /* ignore */ }
  }, [nameProp]);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName: firstName || undefined, source: "post_report_onetime" }),
      });
      const body = (await res.json()) as { success?: boolean; error?: string };
      if (body.success) {
        setDone(true);
      } else {
        setError(body.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: "#1f1d19",
        marginTop: "4rem",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        padding: "5rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <p
          className="font-sans text-xs tracking-[0.25em] uppercase mb-5"
          style={{ color: "var(--gold)" }}
        >
          Your Pattern Sharpens Every Day
        </p>
        <h2
          className="font-serif font-light mb-6"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--cream)", lineHeight: 1.15 }}
        >
          This report is based on
          <br />your turning points so far.
        </h2>

        <p
          className="font-sans font-light text-sm leading-relaxed mb-4"
          style={{ color: "var(--warm)" }}
        >
          Imagine what becomes visible when you add daily data.
        </p>
        <p
          className="font-sans font-light text-sm leading-relaxed mb-4"
          style={{ color: "var(--warm)" }}
        >
          Monthly subscribers get a daily email — one insight, every morning,
          built from your growing pattern data.
        </p>
        <p
          className="font-sans font-light text-sm leading-relaxed mb-10"
          style={{ color: "var(--warm)" }}
        >
          The longer you record, the more precise your choices become.
          The people on the waitlist get first access and a permanent launch discount.
        </p>

        {done ? (
          <div style={{ borderLeft: "2px solid var(--gold)", paddingLeft: "1.25rem" }}>
            <p className="font-serif font-light text-lg mb-2" style={{ color: "var(--cream)" }}>
              {firstName ? `You’re on the list, ${firstName}.` : "You’re on the list."}
            </p>
            <p className="font-sans text-sm" style={{ color: "var(--muted)" }}>
              We&apos;ll reach you at <span style={{ color: "var(--cream)" }}>{email}</span> when
              monthly launches.
            </p>
          </div>
        ) : (
          <form onSubmit={handleJoin}>
            {!prefilled && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="font-sans text-sm w-full mb-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "none",
                  borderBottom: "1px solid rgba(201,168,76,0.35)",
                  color: "var(--cream)",
                  padding: "0.75rem 0",
                  outline: "none",
                  width: "100%",
                }}
              />
            )}

            {error && (
              <p className="font-sans text-xs mb-3" style={{ color: "var(--rust)" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email.includes("@")}
              className="font-sans text-xs tracking-widest uppercase transition-all"
              style={{
                background: loading || !email.includes("@") ? "rgba(201,168,76,0.4)" : "var(--gold)",
                color: "var(--ink)",
                border: "none",
                padding: "0.85rem 2rem",
                cursor: loading || !email.includes("@") ? "not-allowed" : "pointer",
                fontWeight: 500,
                letterSpacing: "0.12em",
              }}
            >
              {loading
                ? "Joining…"
                : prefilled
                ? `Join with ${email} →`
                : "Join the Waitlist →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function ClosingStatementBlock({ cs }: { cs: ClosingStatement }) {
  return (
    <div
      style={{
        background: "#1f1d19",
        marginTop: "4rem",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        padding: "5rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            width: "40px",
            height: "1px",
            background: "rgba(201,168,76,0.35)",
            margin: "0 auto 3rem",
          }}
        />
        <h2
          className="font-serif font-light mb-8"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "var(--cream)",
            lineHeight: 1.2,
          }}
        >
          {cs.headline}
        </h2>
        <p
          className="font-sans font-light text-sm leading-relaxed mb-10"
          style={{ color: "var(--muted)", maxWidth: "560px", margin: "0 auto 2.5rem" }}
        >
          {cs.body}
        </p>
        <p
          className="font-serif font-light"
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
            color: "var(--gold)",
            fontStyle: "italic",
            lineHeight: 1.45,
          }}
        >
          {cs.final_line}
        </p>
      </div>
    </div>
  );
}

function SharePatternButton() {
  const [loading, setLoading] = useState(false);

  async function handleShare() {
    let url = window.location.href;
    let reportId: string | null = null;
    try { reportId = localStorage.getItem("seyrn-report-id"); } catch { /* ignore */ }

    if (reportId) {
      setLoading(true);
      try {
        const res = await fetch("/api/reports/share-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reportId }),
        });
        if (res.ok) {
          const body = await res.json() as { shareToken?: string };
          if (body.shareToken) url = `${window.location.origin}/s/${body.shareToken}`;
        }
      } catch { /* fallback to current URL */ } finally {
        setLoading(false);
      }
    }

    if (navigator.share) {
      navigator.share({ title: "My Life Pattern — Seyrn", url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <button
        onClick={handleShare}
        disabled={loading}
        className="font-sans text-xs tracking-widest uppercase transition-all duration-300"
        style={{
          background: "transparent",
          color: loading ? "var(--muted)" : "var(--gold)",
          border: "1px solid rgba(201,168,76,0.4)",
          padding: "0.85rem 2rem",
          cursor: loading ? "wait" : "pointer",
          letterSpacing: "0.12em",
        }}
      >
        {loading ? "Getting link…" : "Share Your Pattern →"}
      </button>
    </div>
  );
}

// Scroll-triggered visibility for sections
function useVisible() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useVisible();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function ReportSections({ report, isPaid, plan, turningPoints, currentSeason, firstName, shareMode }: Props) {
  const { sections } = report;

  return (
    <div className="space-y-0">

      {/* Pattern identity — FREE */}
      <AnimatedSection>
        <div className="mb-16 text-center py-12">
          <p
            className="font-sans text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: "var(--muted)" }}
          >
            {firstName ? `${firstName}'s Life Pattern` : "Your Life Pattern"}
          </p>
          <h2
            className="font-serif font-light mb-3"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--cream)",
              lineHeight: 1.1,
            }}
          >
            {report.pattern_name}
          </h2>
          <p
            className="font-sans font-light text-sm max-w-md mx-auto"
            style={{ color: "var(--muted)" }}
          >
            {report.pattern_archetype}
          </p>

          {!shareMode && <ShareCard report={report} turningPoints={turningPoints} currentSeason={currentSeason} firstName={firstName} />}
        </div>
      </AnimatedSection>

      <div className="divider-gold" />

      {/* Energy Cycle — FREE */}
      <AnimatedSection delay={0.1}>
        <div className="py-16">
          <SectionLabel>Energy Pattern</SectionLabel>
          <SectionHeadline>{sections.energy_cycle.summary}</SectionHeadline>
          {sections.energy_cycle.detail.split("\n\n").map((para, i) => (
            <BodyText key={i}>{para}</BodyText>
          ))}
          <DataBasis content={sections.energy_cycle.data_basis} />
          <TodayBlock content={sections.energy_cycle.today} />
        </div>
      </AnimatedSection>

      {/* Free cliffhanger */}
      {!isPaid && <FreeEnding report={report} />}

      {/* Paywall sentinel */}
      <div id="paywall-start" />

      <div className="divider-gold" />

      {/* Relationship Pattern — PAID */}
      <AnimatedSection>
        <div className="py-16">
          <PatternSectionBlock
            label="Relationship Pattern"
            section={sections.relationship_pattern}
            isPaid={isPaid}
          />
        </div>
      </AnimatedSection>

      <div className="divider-gold" />

      {/* Risk Pattern — PAID */}
      <AnimatedSection>
        <div className="py-16">
          <PatternSectionBlock
            label="Risk Pattern"
            section={sections.risk_pattern}
            isPaid={isPaid}
          />
        </div>
      </AnimatedSection>

      <div className="divider-gold" />

      {/* Emotion Pattern — PAID */}
      <AnimatedSection>
        <div className="py-16">
          <PatternSectionBlock
            label="Emotional Driver"
            section={sections.emotion_pattern}
            isPaid={isPaid}
          />
        </div>
      </AnimatedSection>

      <div className="divider-gold" />

      {/* Next Turning Point — teaser always visible, detail PAID */}
      <AnimatedSection>
        <div className="py-16">
          <SectionLabel>What the Pattern Points Toward</SectionLabel>

          {/* Always visible teaser */}
          <p
            className="font-serif font-light mb-8"
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              color: "var(--gold)",
              fontStyle: "italic",
            }}
          >
            {sections.next_turning_point.summary}
          </p>

          <BlurGate isPaid={isPaid}>
            <div
              className="mb-6 inline-block px-4 py-2"
              style={{
                background: "rgba(201,168,76,0.06)",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
            >
              <p className="font-sans text-xs tracking-[0.15em] uppercase mb-1" style={{ color: "var(--muted)" }}>
                Pattern-Based Timeframe
              </p>
              <p className="font-serif font-light text-xl" style={{ color: "var(--gold)" }}>
                {sections.next_turning_point.timeframe}
              </p>
            </div>

            {sections.next_turning_point.detail.split("\n\n").map((para, i) => (
              <BodyText key={i}>{para}</BodyText>
            ))}

            <div className="mt-6 mb-2">
              <p className="font-sans text-xs tracking-[0.15em] uppercase mb-3" style={{ color: "var(--muted)" }}>
                Preparation Window
              </p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--warm)" }}>
                {sections.next_turning_point.preparation}
              </p>
            </div>

            <TodayBlock content={sections.next_turning_point.today} />
          </BlurGate>
        </div>
      </AnimatedSection>

      <div className="divider-gold" />

      {/* The One Thing — PAID */}
      <AnimatedSection>
        <div className="py-16">
          <BlurGate isPaid={isPaid}>
            <SectionLabel>The One Thing</SectionLabel>
            <div
              className="mb-8 p-6"
              style={{
                background: "rgba(201,168,76,0.04)",
                border: "1px solid rgba(201,168,76,0.18)",
                borderLeft: "3px solid var(--gold)",
              }}
            >
              <p
                className="font-serif font-light"
                style={{ fontSize: "clamp(1.2rem, 3vw, 1.75rem)", color: "var(--cream)", lineHeight: 1.35 }}
              >
                {sections.one_thing_now.statement}
              </p>
            </div>
            <BodyText>{sections.one_thing_now.reason}</BodyText>
            <TodayBlock content={sections.one_thing_now.today} />
          </BlurGate>
        </div>
      </AnimatedSection>

      <div className="divider-gold" />

      {/* Season Diagnosis — PAID */}
      <AnimatedSection>
        <div className="py-16">
          <BlurGate isPaid={isPaid}>
            <SectionLabel>Your Current Season</SectionLabel>
            <div className="mb-6">
              <p
                className="font-serif font-light"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--gold)", lineHeight: 1 }}
              >
                {sections.season_diagnosis.current}
              </p>
            </div>
            {sections.season_diagnosis.description.split("\n\n").map((para, i) => (
              <BodyText key={i}>{para}</BodyText>
            ))}
            <TodayBlock content={sections.season_diagnosis.today} />
          </BlurGate>
        </div>
      </AnimatedSection>

      <div className="divider-gold" />

      {/* Pattern Warning — PAID */}
      <AnimatedSection>
        <div className="py-16">
          <BlurGate isPaid={isPaid}>
            <p
              className="font-sans text-xs tracking-[0.2em] uppercase mb-5"
              style={{ color: "var(--rust)" }}
            >
              Pattern Warning
            </p>
            <div
              className="mb-6 p-5"
              style={{
                background: "rgba(139,74,47,0.05)",
                border: "1px solid rgba(139,74,47,0.18)",
                borderLeft: "3px solid var(--rust)",
              }}
            >
              <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--warm)" }}>
                {sections.pattern_warning.summary}
              </p>
            </div>
            {sections.pattern_warning.detail.split("\n\n").map((para, i) => (
              <BodyText key={i}>{para}</BodyText>
            ))}
            <div
              style={{
                borderLeft: "3px solid var(--rust)",
                background: "rgba(139,74,47,0.04)",
                padding: "1rem 1.25rem",
                marginTop: "1.5rem",
              }}
            >
              <p
                className="font-sans text-[10px] tracking-[0.2em] uppercase mb-2"
                style={{ color: "var(--rust)" }}
              >
                How to Catch It Today
              </p>
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: "var(--cream)", fontStyle: "italic" }}
              >
                {sections.pattern_warning.today}
              </p>
            </div>
          </BlurGate>
        </div>
      </AnimatedSection>

      {/* Closing statement + share — paid users only, hidden in share mode */}
      {isPaid && !shareMode && sections.closing_statement && (
        <>
          <ClosingStatementBlock cs={sections.closing_statement} />
          <SharePatternButton />
        </>
      )}

      {/* Closing statement — share mode shows it without share button */}
      {shareMode && sections.closing_statement && (
        <ClosingStatementBlock cs={sections.closing_statement} />
      )}

      {/* Waitlist CTA — one-time paid users only, hidden in share mode */}
      {isPaid && !shareMode && plan === "one-time" && <WaitlistSection firstName={firstName} />}
    </div>
  );
}
