"use client";

import { useState } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { OnboardingData, TurningPoint } from "@/lib/onboarding-types";
import { energyColor } from "@/lib/onboarding-utils";

// ── Chart data types ───────────────────────────────────────

interface ChartPoint {
  year:       number;
  energy?:    number;   // past + current position
  projected?: number;   // current + future
  tpId?:      string;   // set only on actual turning point years
}

interface DotRenderProps {
  cx:      number;
  cy:      number;
  payload: ChartPoint;
}

// ── Data building ──────────────────────────────────────────

function computeCurrentEnergy(data: OnboardingData, lastTP: TurningPoint | undefined): number {
  const base = lastTP?.energyLevel ?? 5;
  if (!data.currentSeason) return base;
  const offsets: Record<string, number> = { spring: 0, summer: 2, autumn: 1, winter: -1 };
  const adj = offsets[data.currentSeason] ?? 0;
  return Math.min(10, Math.max(1, base + adj));
}

interface Projection {
  points:       ChartPoint[];
  nextPeakYear: number;
  peakEnergy:   number;
}

function buildProjection(
  validTPs:      TurningPoint[],
  currentYear:   number,
  futureYear:    number,
  startEnergy:   number
): Projection {
  const years = validTPs.map((tp) => tp.year!).sort((a, b) => a - b);

  let avgInterval = 6;
  if (years.length >= 2) {
    const intervals = years.slice(1).map((y, i) => y - years[i]);
    const total     = intervals.reduce((a, b) => a + b, 0);
    avgInterval     = Math.max(3, Math.min(12, Math.round(total / intervals.length)));
  }

  const nextPeakYear = Math.min(currentYear + avgInterval, futureYear);
  const peakEnergy   = Math.min(10, Math.round(startEnergy + 1.5));

  const points: ChartPoint[] = [{ year: currentYear, projected: startEnergy }];

  if (nextPeakYear > currentYear) {
    const midYear = Math.round((currentYear + nextPeakYear) / 2);
    if (midYear > currentYear) {
      points.push({ year: midYear, projected: Math.round((startEnergy + peakEnergy) / 2) });
    }
    points.push({ year: nextPeakYear, projected: peakEnergy });

    const postPeakYear = Math.min(nextPeakYear + Math.round(avgInterval * 0.65), futureYear);
    if (postPeakYear > nextPeakYear) {
      points.push({ year: postPeakYear, projected: Math.round(peakEnergy * 0.72) });
    }
  }

  if (points[points.length - 1].year < futureYear) {
    points.push({ year: futureYear, projected: Math.max(1, Math.round(startEnergy * 0.88)) });
  }

  return { points, nextPeakYear, peakEnergy };
}

interface ChartBuild {
  chartData:     ChartPoint[];
  currentYear:   number;
  futureYear:    number;
  validTPs:      TurningPoint[];
  currentEnergy: number;
  nextPeakYear:  number;
}

function buildChartData(data: OnboardingData): ChartBuild {
  const currentYear = new Date().getFullYear();
  const futureYear  = currentYear + (data.futureAge - data.currentAge);

  const validTPs = data.turningPoints
    .filter((tp) => tp.year !== null && tp.title.length > 0)
    .sort((a, b) => (a.year ?? 0) - (b.year ?? 0));

  if (validTPs.length === 0) {
    return { chartData: [], currentYear, futureYear, validTPs, currentEnergy: 5, nextPeakYear: currentYear + 5 };
  }

  const lastTP        = validTPs[validTPs.length - 1];
  const currentEnergy = computeCurrentEnergy(data, lastTP);

  // Build past point map (year → ChartPoint)
  const pastMap = new Map<number, ChartPoint>();
  for (const tp of validTPs) {
    pastMap.set(tp.year!, { year: tp.year!, energy: tp.energyLevel, tpId: tp.id });
  }
  // Current year (only if it doesn't already coincide with a TP)
  if (!pastMap.has(currentYear)) {
    pastMap.set(currentYear, { year: currentYear, energy: currentEnergy });
  }

  const { points: projectedPoints, nextPeakYear } = buildProjection(
    validTPs, currentYear, futureYear, currentEnergy
  );

  // Merge all years
  const allYears = new Set<number>([
    ...Array.from(pastMap.keys()),
    ...projectedPoints.map((p) => p.year),
  ]);

  const chartData: ChartPoint[] = Array.from(allYears)
    .sort((a, b) => a - b)
    .map((year) => {
      const past   = pastMap.get(year);
      const future = projectedPoints.find((p) => p.year === year);
      return {
        year,
        energy:    past?.energy,
        projected: future?.projected,
        tpId:      past?.tpId,
      };
    });

  return { chartData, currentYear, futureYear, validTPs, currentEnergy, nextPeakYear };
}

// ── Label helpers ──────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  career:         "Career / Work",
  relationship:   "Relationship",
  place:          "Place / Move",
  "inner-shift":  "Inner Shift",
  "loss-failure": "Loss / Failure",
  "leap-success": "Leap / Success",
};

const OUTCOME_LABELS: Record<string, string> = {
  grew:                "Grew significantly",
  stagnated:           "Stagnated",
  "direction-changed": "Direction changed",
  "fell-apart-rebuilt":"Fell apart, then rebuilt",
};

// ── Sub-components ─────────────────────────────────────────

function TPChip({
  tp,
  isActive,
  onClick,
}: {
  tp:       TurningPoint;
  isActive: boolean;
  onClick:  () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-none flex items-center gap-2.5 px-4 py-2.5 transition-all duration-200 text-left"
      style={{
        background: isActive ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.025)",
        border:     `1px solid ${isActive ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`,
        minWidth:   "148px",
      }}
    >
      <div
        className="w-2 h-2 rounded-full flex-none"
        style={{ background: energyColor(tp.energyLevel) }}
      />
      <div className="min-w-0">
        <p className="font-sans text-[10px] tracking-widest uppercase mb-0.5" style={{ color: "var(--muted)" }}>
          {tp.year}
        </p>
        <p
          className="font-serif font-light text-sm truncate"
          style={{ color: isActive ? "var(--cream)" : "var(--warm)" }}
        >
          {tp.title || "Untitled"}
        </p>
      </div>
    </button>
  );
}

function TPDetail({ tp, currentAge }: { tp: TurningPoint; currentAge: number }) {
  const birthYear = new Date().getFullYear() - currentAge;
  const ageAtTP   = tp.year ? tp.year - birthYear : null;
  const color     = energyColor(tp.energyLevel);

  return (
    <div
      className="mt-3 p-6"
      style={{
        background: "rgba(255,255,255,0.02)",
        border:     "1px solid rgba(201,168,76,0.12)",
        animation:  "fadeUp 0.3s ease-out forwards",
      }}
    >
      <div className="flex items-start justify-between gap-8 mb-6">
        <div>
          <p className="font-sans text-[10px] tracking-[0.15em] uppercase mb-1.5" style={{ color: "var(--muted)" }}>
            {tp.year}{ageAtTP ? ` · Age ${ageAtTP}` : ""}
            {tp.category ? ` · ${CATEGORY_LABELS[tp.category] ?? tp.category}` : ""}
          </p>
          <h3 className="font-serif font-light text-xl" style={{ color: "var(--cream)" }}>
            {tp.title || "Untitled turning point"}
          </h3>
        </div>
        <div className="flex-none text-right">
          <p className="font-sans text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--muted)" }}>
            Energy
          </p>
          <p className="font-serif font-light" style={{ fontSize: "2.5rem", lineHeight: 1, color }}>
            {tp.energyLevel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {tp.emotions.length > 0 && (
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase mb-2" style={{ color: "var(--muted)" }}>
              Emotions
            </p>
            <div className="flex flex-wrap gap-1">
              {tp.emotions.map((e) => (
                <span
                  key={e}
                  className="font-sans text-xs px-2 py-0.5 capitalize"
                  style={{ background: "rgba(255,255,255,0.04)", color: "var(--warm)" }}
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}
        {tp.outcome && (
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase mb-2" style={{ color: "var(--muted)" }}>
              Outcome
            </p>
            <p className="font-sans text-xs" style={{ color: "var(--warm)" }}>
              {OUTCOME_LABELS[tp.outcome] ?? tp.outcome}
            </p>
          </div>
        )}
        {tp.personType && (
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase mb-2" style={{ color: "var(--muted)" }}>
              With
            </p>
            <p className="font-sans text-xs capitalize" style={{ color: "var(--warm)" }}>
              {tp.personType === "alone" ? "No one" : `A ${tp.personType}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Custom tooltip ─────────────────────────────────────────

interface TooltipProps {
  active?:  boolean;
  payload?: ReadonlyArray<{ readonly payload: ChartPoint }>;
}

function ChartTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  if (!point.tpId) return null;

  return (
    <div
      className="font-sans text-xs"
      style={{
        background:    "rgba(15,14,12,0.95)",
        border:        "1px solid rgba(201,168,76,0.2)",
        padding:       "6px 10px",
        pointerEvents: "none",
      }}
    >
      <p style={{ color: "var(--muted)" }}>{point.year}</p>
      <p style={{ color: "var(--gold)" }}>Energy {point.energy}</p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────

export default function LifeGraph({ data }: { data: OnboardingData }) {
  const [activeTPId, setActiveTPId] = useState<string | null>(null);

  const { chartData, currentYear, validTPs, currentEnergy, nextPeakYear } =
    buildChartData(data);

  const activeTP = validTPs.find((tp) => tp.id === activeTPId) ?? null;
  const tpMap    = new Map(validTPs.map((tp) => [tp.id, tp]));

  // Custom dot renderer — TP points become interactive circles
  function renderDot(dotProps: object) {
    const { cx, cy, payload } = dotProps as DotRenderProps;

    // Current-year point — glowing gold dot (no click)
    if (!payload.tpId) {
      if (payload.year === currentYear && payload.energy !== undefined) {
        return (
          <g key={`cur-${cx}`}>
            <circle cx={cx} cy={cy} r={12} fill="rgba(201,168,76,0.12)" />
            <circle cx={cx} cy={cy} r={5}  fill="var(--gold)" />
          </g>
        );
      }
      return <g key={`skip-${cx}`} />;
    }

    const tp       = tpMap.get(payload.tpId);
    if (!tp) return <g key={`miss-${cx}`} />;

    const isActive = tp.id === activeTPId;
    const color    = energyColor(tp.energyLevel);

    return (
      <g
        key={tp.id}
        style={{ cursor: "pointer" }}
        onClick={() => setActiveTPId(isActive ? null : tp.id)}
      >
        {isActive && (
          <circle cx={cx} cy={cy} r={15} fill={color} opacity={0.15} />
        )}
        <circle cx={cx} cy={cy} r={isActive ? 9 : 7} fill={color} />
        <circle
          cx={cx}
          cy={cy}
          r={isActive ? 9 : 7}
          fill="transparent"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={1}
        />
      </g>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-sans text-sm" style={{ color: "var(--muted)" }}>
          No turning points with years found.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--muted)" }}>
          Life Energy Graph
        </p>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="h-px w-7" style={{ background: "var(--gold)" }} />
            <span className="font-sans text-[10px] tracking-widest" style={{ color: "var(--muted)" }}>
              PAST
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="28" height="2" viewBox="0 0 28 2">
              <line
                x1="0" y1="1" x2="28" y2="1"
                stroke="rgba(201,168,76,0.45)"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
            </svg>
            <span className="font-sans text-[10px] tracking-widest" style={{ color: "var(--muted)" }}>
              PROJECTED
            </span>
          </div>
        </div>
      </div>

      {/* Energy axis labels */}
      <div className="flex items-center gap-3 mb-1">
        <div className="flex flex-col justify-between" style={{ height: 320, paddingTop: 16, paddingBottom: 24 }}>
          {[10, 7, 5, 3, 1].map((n) => (
            <span key={n} className="font-sans text-[10px]" style={{ color: "var(--muted)", lineHeight: 1 }}>
              {n}
            </span>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 16, right: 16, bottom: 8, left: 0 }}>
              <defs>
                <linearGradient id="lifeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#c9a84c" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#c9a84c" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fontFamily: "var(--font-sans)", fontSize: 10, fill: "#7a7268" }}
                tickMargin={10}
              />
              <YAxis domain={[0, 10]} hide />

              {/* Current year divider */}
              <ReferenceLine
                x={currentYear}
                stroke="rgba(255,255,255,0.07)"
                strokeDasharray="4 4"
              />

              {/* Projected turning point marker */}
              <ReferenceLine
                x={nextPeakYear}
                stroke="rgba(201,168,76,0.12)"
                strokeDasharray="3 5"
              />

              {/* Past energy — filled area */}
              <Area
                type="monotone"
                dataKey="energy"
                stroke="var(--gold)"
                strokeWidth={2}
                fill="url(#lifeGradient)"
                connectNulls
                dot={renderDot}
                activeDot={false}
                animationDuration={1400}
              />

              {/* Projected — dashed line */}
              <Line
                type="monotone"
                dataKey="projected"
                stroke="rgba(201,168,76,0.38)"
                strokeWidth={1.5}
                strokeDasharray="6 5"
                connectNulls
                dot={false}
                activeDot={false}
                animationDuration={1800}
                animationBegin={1200}
              />

              <Tooltip content={ChartTooltip} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Current energy + next peak annotation */}
      <div className="flex justify-end gap-6 mt-2 mb-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--gold)" }} />
          <span className="font-sans text-[10px] tracking-widest" style={{ color: "var(--muted)" }}>
            NOW  {currentEnergy}/10
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans text-[10px] tracking-widest" style={{ color: "rgba(201,168,76,0.5)" }}>
            NEXT PIVOT  ~{nextPeakYear}
          </span>
        </div>
      </div>

      {/* Turning point chips */}
      {validTPs.length > 0 && (
        <div>
          <p className="font-sans text-[10px] tracking-[0.15em] uppercase mb-4" style={{ color: "var(--muted)" }}>
            Turning Points
          </p>
          <div className="flex gap-2 overflow-x-auto pb-3">
            {validTPs.map((tp) => (
              <TPChip
                key={tp.id}
                tp={tp}
                isActive={tp.id === activeTPId}
                onClick={() => setActiveTPId(tp.id === activeTPId ? null : tp.id)}
              />
            ))}
          </div>

          {activeTP && (
            <TPDetail tp={activeTP} currentAge={data.currentAge} />
          )}
        </div>
      )}
    </div>
  );
}
