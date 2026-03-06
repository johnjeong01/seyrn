"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceDot,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { useState, useEffect, useRef } from "react";

/* ── Sample data — dummy life graph ─────────────────────── */
const pastData = [
  { age: 22, energy: 5, label: "Graduated, uncertain" },
  { age: 24, energy: 3, label: "First job, drained" },
  { age: 26, energy: 7, label: "Found my direction" },
  { age: 28, energy: 8, label: "First big win" },
  { age: 30, energy: 4, label: "Burnout, relationship ended" },
  { age: 32, energy: 6, label: "Rebuilt, slower" },
  { age: 35, energy: 9, label: "Launched something real" },
  { age: 37, energy: 7, label: "Scaled, team grew" },
  { age: 39, energy: 5, label: "Plateau — familiar" },
  { age: 41, energy: 8, label: "NOW" },  // current
];

const futureData = [
  { age: 41, energy: 8 },
  { age: 43, energy: 5.5 },
  { age: 45, energy: 3.5 }, // predicted low
  { age: 47, energy: 7 },
  { age: 50, energy: 9 },
  { age: 55, energy: 6 },
  { age: 60, energy: 7.5 },
];

/* Season bar data */
const seasons = [
  { label: "Planting",   width: 18, start: 22 },
  { label: "Growing",    width: 22, start: 26 },
  { label: "Shifting",   width: 15, start: 30 },
  { label: "Harvesting", width: 20, start: 35 },
  { label: "Resting",    width: 25, start: 41 },
];

/* Custom tooltip */
type TooltipPayloadItem = { payload: { age: number; energy: number; label?: string } };

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="glass px-4 py-3 text-xs font-sans">
      <p className="text-[var(--gold)] font-medium mb-0.5">Age {d.age}</p>
      <p className="text-[var(--cream)]">{d.label || "—"}</p>
      <p className="text-[var(--muted)] mt-1">Energy: {d.energy}/10</p>
    </div>
  );
}

export default function GraphPreview() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-section bg-[var(--deep)]" id="preview">
      <div className="divider-gold w-full absolute top-0" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-4">
              Your Life as Data
            </p>
            <h2
              className="font-serif font-light text-[var(--cream)]"
              style={{ fontSize: "clamp(2rem,4vw,3.25rem)" }}
            >
              Every peak. Every low.
              <br />
              Every pattern.
            </h2>
          </div>
          <p className="font-sans font-light text-[var(--muted)] text-sm max-w-xs leading-relaxed">
            This is what your life looks like as data. Sample graph below — yours will be built from your actual turning points.
          </p>
        </div>

        {/* Graph container */}
        <div
          className="relative bg-[#0f0e0c] p-6 md:p-10"
          style={{
            border: "1px solid rgba(201,168,76,0.1)",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out",
          }}
        >
          {/* Y-axis label */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 font-sans text-[10px] tracking-widest uppercase text-[var(--muted)]/50 hidden md:block">
            Energy
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mb-6 flex-wrap">
            <span className="flex items-center gap-2 font-sans text-xs text-[var(--muted)]">
              <span className="w-6 h-px bg-[var(--gold)]" />
              Past
            </span>
            <span className="flex items-center gap-2 font-sans text-xs text-[var(--muted)]">
              <span className="w-6 h-px bg-[var(--gold)]/30 border-dashed border-t border-[var(--gold)]/30" />
              Predicted
            </span>
            <span className="flex items-center gap-2 font-sans text-xs text-[var(--muted)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4a6355] inline-block" />
              High energy
            </span>
            <span className="flex items-center gap-2 font-sans text-xs text-[var(--muted)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8b4a2f] inline-block" />
              Low energy
            </span>
          </div>

          {/* Chart */}
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <defs>
                  <linearGradient id="pastFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%"   stopColor="#c9a84c" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#c9a84c" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="futureFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%"   stopColor="#c9a84c" stopOpacity={0.04} />
                    <stop offset="100%" stopColor="#c9a84c" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="0"
                  stroke="rgba(255,255,255,0.03)"
                  horizontal={true}
                  vertical={false}
                />

                <XAxis
                  dataKey="age"
                  type="number"
                  domain={[22, 60]}
                  ticks={[22, 25, 30, 35, 40, 45, 50, 55, 60]}
                  tick={{ fill: "rgba(122,114,104,0.7)", fontSize: 11, fontFamily: "var(--font-sans)" }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  hide
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Current age divider */}
                <ReferenceLine
                  x={41}
                  stroke="rgba(201,168,76,0.25)"
                  strokeDasharray="4 4"
                />

                {/* Past area */}
                <Area
                  data={pastData}
                  dataKey="energy"
                  type="monotone"
                  stroke="#c9a84c"
                  strokeWidth={1.5}
                  fill="url(#pastFill)"
                  dot={false}
                  animationBegin={visible ? 0 : 99999}
                  animationDuration={2000}
                  animationEasing="ease-out"
                />

                {/* Future area (dashed) */}
                <Area
                  data={futureData}
                  dataKey="energy"
                  type="monotone"
                  stroke="rgba(201,168,76,0.25)"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                  fill="url(#futureFill)"
                  dot={false}
                  animationBegin={visible ? 600 : 99999}
                  animationDuration={1800}
                  animationEasing="ease-out"
                />

                {/* Current position — glowing dot */}
                <ReferenceDot
                  x={41}
                  y={8}
                  r={6}
                  fill="#c9a84c"
                  stroke="rgba(201,168,76,0.3)"
                  strokeWidth={8}
                />

                {/* Predicted turning point */}
                <ReferenceDot
                  x={45}
                  y={3.5}
                  r={10}
                  fill="none"
                  stroke="rgba(201,168,76,0.4)"
                  strokeWidth={1.5}
                  strokeDasharray="3 2"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Season bar */}
          <div className="mt-8">
            <div className="flex h-7 w-full overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              {seasons.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center text-[9px] font-sans tracking-widest uppercase transition-opacity duration-300 hover:opacity-80"
                  style={{
                    width: `${s.width}%`,
                    background: i % 2 === 0
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(255,255,255,0.015)",
                    color: i === 4 ? "var(--gold)" : "var(--muted)",
                    borderRight: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <span className="hidden sm:block">{s.label}</span>
                  <span className="sm:hidden">{s.label[0]}</span>
                </div>
              ))}
            </div>
            {/* Gold position marker */}
            <div className="relative h-1 mt-0.5">
              <div
                className="absolute w-1 h-3 bg-[var(--gold)] -top-1"
                style={{ left: "75%", transform: "translateX(-50%)" }}
              />
            </div>
          </div>

          {/* "NOW" label */}
          <div
            className="absolute font-sans text-[10px] tracking-widest uppercase text-[var(--gold)]"
            style={{ bottom: "88px", left: "calc(75% - 12px)", transform: "translateX(-50%)" }}
          >
            Now
          </div>

          {/* Future blur overlay */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              right: 0,
              width: "25%",
              background:
                "linear-gradient(to right, transparent 0%, rgba(15,14,12,0.85) 60%, rgba(15,14,12,0.98) 100%)",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-sans text-xs text-[var(--muted)] text-center px-4 leading-relaxed rotate-0">
                Unlocks
                <br />
                after analysis
              </p>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="mt-6 font-sans text-sm text-[var(--muted)] text-center">
          Sample data · Your graph is built from your actual turning points
        </p>
      </div>
    </section>
  );
}
