"use client";

import { useState, useEffect, useRef } from "react";
import type { ReportData, ReportTheme, ReportMove, ForecastYear } from "@/lib/report-types";
import type { TurningPoint } from "@/lib/onboarding-types";
import ShareCard from "./ShareCard";

interface Props {
  report: ReportData;
  isPaid: boolean;
  plan: "one-time" | "monthly" | null;
  turningPoints: TurningPoint[];
  currentSeason?: string | null;
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
      className="font-serif font-light mb-8"
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

function ThemeCard({ theme }: { theme: ReportTheme }) {
  return (
    <div
      className="p-6 rounded-sm"
      style={{ background: "var(--deep)", border: "1px solid rgba(201,168,76,0.12)" }}
    >
      <p
        className="font-serif font-light text-lg mb-3"
        style={{ color: "var(--cream)" }}
      >
        {theme.title}
      </p>
      <p
        className="font-sans text-sm leading-relaxed mb-3"
        style={{ color: "var(--warm)" }}
      >
        {theme.description}
      </p>
      <p
        className="font-sans text-xs"
        style={{ color: "var(--muted)" }}
      >
        Evidence: {theme.evidence}
      </p>
    </div>
  );
}

function MoveCard({ move, index }: { move: ReportMove; index: number }) {
  return (
    <div className="flex gap-5 items-start">
      <span
        className="font-serif font-light text-2xl shrink-0 mt-0.5"
        style={{ color: "var(--gold)", lineHeight: 1 }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <p
          className="font-serif font-light text-base mb-1"
          style={{ color: "var(--cream)" }}
        >
          {move.title}
        </p>
        <p
          className="font-sans text-sm leading-relaxed"
          style={{ color: "var(--warm)" }}
        >
          {move.action}
        </p>
      </div>
    </div>
  );
}

function TimeframeBlock({ label, content }: { label: string; content: string }) {
  return (
    <div>
      <p
        className="font-sans text-xs tracking-[0.15em] uppercase mb-3"
        style={{ color: "var(--gold)" }}
      >
        {label}
      </p>
      <p
        className="font-sans text-sm leading-relaxed"
        style={{ color: "var(--warm)" }}
      >
        {content}
      </p>
    </div>
  );
}

function ForecastTimeline({
  years,
  currentYear,
}: {
  years: ForecastYear[];
  currentYear: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Continuous vertical line — animates top-to-bottom on scroll */}
      <div
        style={{
          position: "absolute",
          left: "calc(88px + 14px)", // left col (88px) + half of center col (28px)
          top: "12px",
          bottom: "12px",
          width: "1px",
          background: "rgba(201,168,76,0.2)",
          transformOrigin: "top",
          transform: visible ? "scaleY(1)" : "scaleY(0)",
          transition: "transform 0.8s ease 0.1s",
        }}
      />

      {years.map((yr, i) => {
        const isHigh   = yr.energy >= 8;
        const isMed    = yr.energy >= 6 && yr.energy < 8;
        const barPct   = (yr.energy / 10) * 100;
        const isCurrent = yr.year === currentYear;
        const delay    = `${0.15 + i * 0.12}s`;

        const nodeColor  = isHigh ? "var(--gold)" : isMed ? "transparent" : "rgba(122,114,104,0.4)";
        const nodeBorder = isHigh
          ? "2px solid var(--gold)"
          : isMed
          ? "1.5px solid var(--gold)"
          : "1px solid rgba(122,114,104,0.4)";
        const barColor = yr.energy >= 8
          ? "var(--sage)"
          : yr.energy <= 4
          ? "var(--rust)"
          : "var(--gold)";

        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "88px 28px 1fr",
              gap: "0 1rem",
              alignItems: "center",
              marginBottom: i < years.length - 1 ? "2rem" : 0,
              opacity: visible ? 1 : 0,
              transition: `opacity 0.5s ease ${delay}`,
            }}
          >
            {/* Left: year + milestone */}
            <div style={{ textAlign: "right", paddingRight: "4px" }}>
              <span
                className="font-serif font-light"
                style={{ fontSize: "1.6rem", color: "var(--gold)", lineHeight: 1, display: "block" }}
              >
                {yr.year}
              </span>
              <p
                className="font-sans text-xs mt-1 leading-tight"
                style={{ color: "var(--cream)" }}
              >
                {yr.theme}
              </p>
              {isCurrent && (
                <p
                  className="font-sans text-[9px] tracking-widest uppercase mt-1.5"
                  style={{ color: "var(--gold)" }}
                >
                  You are here
                </p>
              )}
            </div>

            {/* Center: node */}
            <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
              <div
                className={isCurrent ? "pulse-gold" : ""}
                style={{
                  width: isCurrent ? "14px" : "10px",
                  height: isCurrent ? "14px" : "10px",
                  borderRadius: "50%",
                  background: nodeColor,
                  border: nodeBorder,
                  flexShrink: 0,
                }}
              />
            </div>

            {/* Right: energy bar + label */}
            <div>
              <div
                style={{
                  height: "3px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: visible ? `${barPct}%` : "0%",
                    background: barColor,
                    transition: `width 0.6s ease ${delay}`,
                    borderRadius: "2px",
                  }}
                />
              </div>
              <p className="font-sans text-xs mt-1.5" style={{ color: "var(--muted)" }}>
                Energy {yr.energy}/10
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FreeEnding({ report }: { report: ReportData }) {
  const { sections } = report;
  const predictedYear = sections.next_turning_point.predicted_year;
  const energy = sections.next_turning_point.energy_forecast;
  const isEven = predictedYear % 2 === 0;
  const quarter =
    energy >= 7 ? (isEven ? "Q1" : "Q2") :
    energy >= 5 ? (isEven ? "Q2" : "Q3") :
                  (isEven ? "Q3" : "Q4");

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
        reasonable. It appears in your data as{" "}
        <span
          className="font-serif italic"
          style={{ color: "var(--cream)", filter: "blur(5px)", userSelect: "none" }}
        >
          {sections.recurring_themes.themes?.[0]?.title ?? "the avoidance pattern"}
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
          Your next turning point
        </p>
        <p
          className="font-serif font-light"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 3rem)",
            color: "var(--gold)",
            lineHeight: 1,
          }}
        >
          {quarter} {predictedYear}
        </p>
        <p className="font-sans text-xs mt-2" style={{ color: "var(--muted)" }}>
          The trigger is already in motion.
        </p>
      </div>

      <p
        className="font-serif font-light text-lg leading-relaxed"
        style={{ color: "var(--cream)", fontStyle: "italic" }}
      >
        Will you recognize it this time — or will you only understand what
        happened after it&apos;s already over?
      </p>
    </div>
  );
}

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("seyrn-onboarding-data");
      if (raw) {
        const parsed = JSON.parse(raw) as { email?: string };
        if (parsed.email) {
          setEmail(parsed.email);
          setPrefilled(true);
        }
      }
    } catch { /* ignore */ }
  }, []);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "post_report_onetime" }),
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
          What Comes Next
        </p>
        <h2
          className="font-serif font-light mb-6"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--cream)", lineHeight: 1.15 }}
        >
          Your pattern doesn&apos;t stop here.
        </h2>

        <p
          className="font-sans font-light text-sm leading-relaxed mb-4"
          style={{ color: "var(--warm)" }}
        >
          This report is a snapshot. Your life keeps moving — and so does your pattern.
        </p>
        <p
          className="font-sans font-light text-sm leading-relaxed mb-4"
          style={{ color: "var(--warm)" }}
        >
          Seyrn monthly is launching soon with weekly check-ins, quarterly pattern updates,
          and a daily strategy that sharpens as your data grows.
        </p>
        <p
          className="font-sans font-light text-sm leading-relaxed mb-10"
          style={{ color: "var(--warm)" }}
        >
          The people on the waitlist get first access and a launch discount.
        </p>

        {done ? (
          <div style={{ borderLeft: "2px solid var(--gold)", paddingLeft: "1.25rem" }}>
            <p className="font-serif font-light text-lg mb-2" style={{ color: "var(--cream)" }}>
              You&apos;re on the list.
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

export default function ReportSections({ report, isPaid, plan, turningPoints, currentSeason }: Props) {
  const { sections } = report;
  const delay = (n: number) => ({ animation: `fadeUp 0.8s ease-out ${n * 0.15}s both` });

  return (
    <div className="space-y-0">
      {/* Pattern identity — FREE */}
      <div className="mb-16 text-center py-12" style={delay(0)}>
        <p
          className="font-sans text-xs tracking-[0.3em] uppercase mb-4"
          style={{ color: "var(--muted)" }}
        >
          Your Life Pattern
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

        <ShareCard report={report} turningPoints={turningPoints} currentSeason={currentSeason} />
      </div>

      <div className="divider-gold" />

      {/* Life Pattern — FREE */}
      <div className="py-16" style={delay(1)}>
        <SectionLabel>Pattern Analysis</SectionLabel>
        <SectionHeadline>{sections.life_pattern.headline}</SectionHeadline>
        {sections.life_pattern.body.split("\n\n").map((para, i) => (
          <BodyText key={i}>{para}</BodyText>
        ))}
      </div>

      {/* Free report cliffhanger */}
      {!isPaid && <FreeEnding report={report} />}

      {/* Paywall sentinel — IntersectionObserver watches this */}
      <div id="paywall-start" />

      <div className="divider-gold" />

      {/* Recurring Themes — PAID */}
      <div className="py-16" style={delay(2)}>
        <SectionLabel>Recurring Themes</SectionLabel>
        <BlurGate isPaid={isPaid}>
          <SectionHeadline>{sections.recurring_themes.headline}</SectionHeadline>
          <div
            className="grid gap-4 mb-8"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
          >
            {sections.recurring_themes.themes.map((theme, i) => (
              <ThemeCard key={i} theme={theme} />
            ))}
          </div>
          <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            {sections.recurring_themes.synthesis}
          </p>
        </BlurGate>
      </div>

      <div className="divider-gold" />

      {/* Next Turning Point — teaser visible, rest PAID */}
      <div className="py-16" style={delay(3)}>
        <SectionLabel>Next Turning Point</SectionLabel>

        {/* Teaser line — always visible */}
        <p
          className="font-serif font-light mb-8"
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            color: "var(--gold)",
            fontStyle: "italic",
          }}
        >
          Your next turning point arrives around{" "}
          <span style={{ color: "var(--cream)" }}>
            {sections.next_turning_point.predicted_year}
          </span>
          .
        </p>

        {/* Full detail — PAID */}
        <BlurGate isPaid={isPaid}>
          <SectionHeadline>{sections.next_turning_point.headline}</SectionHeadline>
          <div className="flex gap-8 mb-8 flex-wrap">
            <div>
              <p
                className="font-sans text-xs tracking-[0.15em] uppercase mb-1"
                style={{ color: "var(--muted)" }}
              >
                Predicted Year
              </p>
              <p className="font-serif font-light text-3xl" style={{ color: "var(--gold)" }}>
                {sections.next_turning_point.predicted_year}
              </p>
            </div>
            <div>
              <p
                className="font-sans text-xs tracking-[0.15em] uppercase mb-1"
                style={{ color: "var(--muted)" }}
              >
                Energy Forecast
              </p>
              <p className="font-serif font-light text-3xl" style={{ color: "var(--cream)" }}>
                {sections.next_turning_point.energy_forecast}
                <span className="font-sans text-sm ml-1" style={{ color: "var(--muted)" }}>
                  /10
                </span>
              </p>
            </div>
          </div>
          <p
            className="font-sans text-sm mb-6 italic"
            style={{
              color: "var(--gold)",
              borderLeft: "2px solid var(--gold)",
              paddingLeft: "1rem",
            }}
          >
            {sections.next_turning_point.trigger}
          </p>
          {sections.next_turning_point.body.split("\n\n").map((para, i) => (
            <BodyText key={i}>{para}</BodyText>
          ))}
        </BlurGate>
      </div>

      <div className="divider-gold" />

      {/* Strategy — PAID */}
      <div className="py-16" style={delay(4)}>
        <SectionLabel>Strategic Moves</SectionLabel>
        <BlurGate isPaid={isPaid}>
          <SectionHeadline>{sections.strategy.headline}</SectionHeadline>
          <p
            className="font-serif font-light text-xl mb-10 max-w-2xl"
            style={{ color: "var(--cream)", fontStyle: "italic" }}
          >
            &ldquo;{sections.strategy.core_insight}&rdquo;
          </p>
          <div className="space-y-8 mb-10">
            {sections.strategy.moves.map((move, i) => (
              <MoveCard key={i} move={move} index={i} />
            ))}
          </div>
          {sections.strategy.body.split("\n\n").map((para, i) => (
            <BodyText key={i}>{para}</BodyText>
          ))}
        </BlurGate>
      </div>

      <div className="divider-gold" />

      {/* Action Plan — PAID */}
      <div className="py-16" style={delay(5)}>
        <SectionLabel>Action Plan</SectionLabel>
        <BlurGate isPaid={isPaid}>
          <SectionHeadline>{sections.action_plan.headline}</SectionHeadline>
          <div
            className="grid gap-8"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
          >
            <TimeframeBlock
              label="Next 90 Days"
              content={sections.action_plan.timeframes["90_days"]}
            />
            <TimeframeBlock
              label="6 Months"
              content={sections.action_plan.timeframes["6_months"]}
            />
            <TimeframeBlock label="1 Year" content={sections.action_plan.timeframes["1_year"]} />
          </div>
        </BlurGate>
      </div>

      <div className="divider-gold" />

      {/* Life Forecast — PAID */}
      <div className="py-16" style={delay(6)}>
        <SectionLabel>Life Forecast</SectionLabel>
        <BlurGate isPaid={isPaid}>
          <SectionHeadline>{sections.life_forecast.headline}</SectionHeadline>
          <div className="mb-12 max-w-lg">
            <ForecastTimeline
              years={sections.life_forecast.forecast_years}
              currentYear={new Date().getFullYear()}
            />
          </div>
          <p
            className="font-serif font-light text-xl max-w-2xl"
            style={{ color: "var(--cream)", lineHeight: 1.5, fontStyle: "italic" }}
          >
            {sections.life_forecast.closing}
          </p>
        </BlurGate>
      </div>

      {/* Waitlist CTA — one-time paid users only */}
      {isPaid && plan === "one-time" && <WaitlistSection />}
    </div>
  );
}
