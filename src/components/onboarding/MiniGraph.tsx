"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import type { TurningPoint } from "@/lib/onboarding-types";
import { energyColor } from "@/lib/onboarding-utils";

interface DataPoint {
  year:   number;
  energy: number;
  color:  string;
}

interface DotProps {
  cx:      number;
  cy:      number;
  payload: DataPoint;
}

interface MiniGraphProps {
  turningPoints: TurningPoint[];
}

export default function MiniGraph({ turningPoints }: MiniGraphProps) {
  const points: DataPoint[] = turningPoints
    .filter((tp) => tp.year !== null && tp.title.length > 0)
    .sort((a, b) => (a.year ?? 0) - (b.year ?? 0))
    .map((tp) => ({
      year:   tp.year!,
      energy: tp.energyLevel,
      color:  energyColor(tp.energyLevel),
    }));

  if (points.length === 0) return null;

  return (
    <div className="mb-8" style={{ opacity: 0.5 }}>
      <p className="font-sans text-[9px] tracking-[0.15em] uppercase text-[var(--muted)] mb-2">
        Pattern so far
      </p>
      <div style={{ height: 56 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 6, right: 4, bottom: 0, left: 0 }}>
            <YAxis domain={[1, 10]} hide />
            <XAxis dataKey="year" hide />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="rgba(201,168,76,0.35)"
              strokeWidth={1}
              dot={(dotProps: object) => {
                const { cx, cy, payload } = dotProps as DotProps;
                return (
                  <circle
                    key={`dot-${payload.year}`}
                    cx={cx}
                    cy={cy}
                    r={3}
                    fill={payload.color}
                    strokeWidth={0}
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
