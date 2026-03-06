"use client";

import type { ReportData, ReportTheme, ReportMove, ForecastYear } from "@/lib/report-types";
import type { TurningPoint } from "@/lib/onboarding-types";
import ShareCard from "./ShareCard";

interface Props {
  report: ReportData;
  isPaid: boolean;
  turningPoints: TurningPoint[];
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

function ForecastBar({ year }: { year: ForecastYear }) {
  const pct = ((year.energy - 1) / 9) * 100;
  const isHigh = year.energy >= 7;
  const barColor = isHigh ? "var(--sage)" : year.energy <= 4 ? "var(--rust)" : "var(--gold)";

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-serif font-light text-base" style={{ color: "var(--cream)" }}>
          {year.year}
        </span>
        <span className="font-sans text-xs" style={{ color: "var(--muted)" }}>
          {year.theme}
        </span>
      </div>
      <div
        className="relative h-1 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <p className="font-sans text-xs mt-1" style={{ color: "var(--muted)" }}>
        Energy {year.energy}/10
      </p>
    </div>
  );
}

export default function ReportSections({ report, isPaid, turningPoints }: Props) {
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

        <ShareCard report={report} turningPoints={turningPoints} />
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
          <div className="space-y-6 mb-12 max-w-lg">
            {sections.life_forecast.forecast_years.map((year, i) => (
              <ForecastBar key={i} year={year} />
            ))}
          </div>
          <p
            className="font-serif font-light text-xl max-w-2xl"
            style={{ color: "var(--cream)", lineHeight: 1.5, fontStyle: "italic" }}
          >
            {sections.life_forecast.closing}
          </p>
        </BlurGate>
      </div>
    </div>
  );
}
