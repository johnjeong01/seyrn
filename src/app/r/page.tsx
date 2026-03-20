import type { Metadata } from "next";
import Link from "next/link";

interface ShareData {
  n: string;
  a: string;
  s?: [string, string];
  y?: number;
  m?: number | null;
  sea?: string | null;
  tps?: Array<{ yr: number; e: number }>;
  fn?: string;
}

function decode(d: string): ShareData | null {
  try {
    return JSON.parse(decodeURIComponent(d)) as ShareData;
  } catch {
    return null;
  }
}

// ── SVG Waveform (server-rendered) ──────────────────────────────

function WaveformSVG({
  tps,
  predictedYear,
}: {
  tps: Array<{ yr: number; e: number }>;
  predictedYear?: number;
}) {
  if (!tps || tps.length === 0) return null;

  const sorted = [...tps].sort((a, b) => a.yr - b.yr);
  const VW = 1000;
  const VH = 130;
  const PX = 20;
  const PY = 22;

  const minYr = sorted[0].yr;
  const maxYr =
    predictedYear && predictedYear > sorted[sorted.length - 1].yr
      ? predictedYear
      : sorted[sorted.length - 1].yr;
  const yrRange = Math.max(maxYr - minYr, 1);

  const toX = (yr: number) =>
    PX + ((yr - minYr) / yrRange) * (VW - PX * 2);
  const toY = (e: number) =>
    VH - PY - ((e - 1) / 9) * (VH - PY * 2);

  const pts = sorted.map((tp) => ({
    x: toX(tp.yr),
    y: toY(tp.e),
    e: tp.e,
  }));

  // Bezier path for line
  let linePath = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cx = (pts[i].x + pts[i + 1].x) / 2;
    linePath += ` C ${cx} ${pts[i].y} ${cx} ${pts[i + 1].y} ${pts[i + 1].x} ${pts[i + 1].y}`;
  }

  // Area under curve
  let areaPath = `M ${pts[0].x} ${VH} L ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cx = (pts[i].x + pts[i + 1].x) / 2;
    areaPath += ` C ${cx} ${pts[i].y} ${cx} ${pts[i + 1].y} ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  areaPath += ` L ${pts[pts.length - 1].x} ${VH} Z`;

  const last = pts[pts.length - 1];
  const hasFuture =
    predictedYear && predictedYear > sorted[sorted.length - 1].yr;
  const futureX = VW - PX;
  const futureY = toY(5);

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: "100%", display: "block", overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rWaveArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path d={areaPath} fill="url(#rWaveArea)" />

      {/* Main line */}
      <path
        d={linePath}
        fill="none"
        stroke="rgba(201,168,76,0.52)"
        strokeWidth="1.5"
      />

      {/* Future dashed hint */}
      {hasFuture && (
        <line
          x1={last.x}
          y1={last.y}
          x2={futureX}
          y2={futureY}
          stroke="rgba(201,168,76,0.13)"
          strokeWidth="1"
          strokeDasharray="5 7"
        />
      )}

      {/* Dots */}
      {pts.map((pt, i) => {
        const isLast = i === pts.length - 1;
        const col =
          pt.e >= 7 ? "#4a6355" : pt.e <= 4 ? "#8b4a2f" : "#c9a84c";
        const fill = isLast ? "#c9a84c" : col;
        return (
          <g key={i}>
            {isLast && (
              <>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="34"
                  fill="none"
                  stroke="rgba(201,168,76,0.03)"
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="23"
                  fill="none"
                  stroke="rgba(201,168,76,0.055)"
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="14"
                  fill="none"
                  stroke="rgba(201,168,76,0.09)"
                />
              </>
            )}
            <circle cx={pt.x} cy={pt.y} r={isLast ? "6" : "4.5"} fill={fill} />
            {!isLast && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r="8.5"
                fill="none"
                stroke={col}
                strokeOpacity="0.3"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Metadata ─────────────────────────────────────────────────────

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { d?: string };
}): Promise<Metadata> {
  const d = searchParams.d;
  if (!d) return { title: "Seyrn — Life Pattern Analysis" };

  const data = decode(d);
  if (!data) return { title: "Seyrn — Life Pattern Analysis" };

  const title = `"${data.n}" — Seyrn`;
  const description = `${data.a} · Seyrn life pattern analysis`;
  const ogUrl = `/api/og?d=${encodeURIComponent(d)}`;

  return {
    title,
    description,
    openGraph: {
      title: `"${data.n}"`,
      description,
      images: [{ url: ogUrl, width: 1080, height: 1080, alt: data.n }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `"${data.n}"`,
      description,
      images: [ogUrl],
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────

function NotFoundPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <p
        className="font-sans text-xs tracking-[0.2em] uppercase"
        style={{ color: "var(--muted)" }}
      >
        {message}
      </p>
      <Link
        href="/"
        className="font-sans text-xs tracking-widest uppercase"
        style={{ color: "var(--gold)" }}
      >
        seyrn.app →
      </Link>
    </div>
  );
}

export default function SharedPatternPage({
  searchParams,
}: {
  searchParams: { d?: string };
}) {
  const d = searchParams.d;
  if (!d) return <NotFoundPage message="No pattern found." />;

  const data = decode(d);
  if (!data) return <NotFoundPage message="Invalid pattern link." />;

  const seasonLabel = data.sea
    ? data.sea.charAt(0).toUpperCase() + data.sea.slice(1)
    : null;

  return (
    <main style={{ background: "var(--ink)", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "clamp(3rem, 8vw, 5rem) 1.5rem clamp(4rem, 10vw, 7rem)",
        }}
      >

        {/* ── Section 1: Identity ── */}
        <p
          className="font-sans text-xs tracking-[0.3em] uppercase mb-8"
          style={{ color: "var(--gold)", opacity: 0.85 }}
        >
          {data.fn ? `You're viewing ${data.fn}'s life pattern · Seyrn` : "Life Pattern · Seyrn"}
        </p>

        <h1
          className="font-serif font-light"
          style={{
            fontSize: "clamp(2.25rem, 7vw, 3.75rem)",
            lineHeight: 1.06,
            color: "var(--cream)",
            marginBottom: "0.75rem",
          }}
        >
          {data.n}
        </h1>

        <p
          className="font-sans font-light"
          style={{
            fontSize: "0.875rem",
            lineHeight: 1.6,
            color: "var(--muted)",
            marginBottom: "2.5rem",
          }}
        >
          {data.a}
        </p>

        {/* Life graph waveform */}
        {data.tps && data.tps.length >= 2 && (
          <div
            style={{
              marginBottom: "2.5rem",
              padding: "1.25rem 0 0.5rem",
              borderTop: "1px solid rgba(201,168,76,0.1)",
              borderBottom: "1px solid rgba(201,168,76,0.1)",
            }}
          >
            <p
              className="font-sans text-xs tracking-[0.18em] uppercase mb-4"
              style={{ color: "var(--muted)", opacity: 0.6, fontSize: "0.6rem" }}
            >
              Life energy · {data.tps.length} turning points recorded
            </p>
            <WaveformSVG tps={data.tps} predictedYear={data.y} />
          </div>
        )}

        {/* ── Section 2: Share sentences ── */}
        {data.s && data.s[0] && data.s[1] && (
          <div style={{ marginBottom: "2.5rem" }}>
            <div
              style={{
                borderLeft: "2px solid rgba(201,168,76,0.32)",
                paddingLeft: "1.25rem",
                marginBottom: "1.25rem",
              }}
            >
              <p
                className="font-serif font-light"
                style={{
                  fontSize: "clamp(1.05rem, 3vw, 1.25rem)",
                  lineHeight: 1.55,
                  color: "var(--cream)",
                  fontStyle: "italic",
                  marginBottom: "1rem",
                }}
              >
                &ldquo;{data.s[0]}&rdquo;
              </p>
              <p
                className="font-serif font-light"
                style={{
                  fontSize: "clamp(1.05rem, 3vw, 1.25rem)",
                  lineHeight: 1.55,
                  color: "var(--warm)",
                  fontStyle: "italic",
                }}
              >
                &ldquo;{data.s[1]}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* ── Section 3: Data row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
            padding: "1.25rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(201,168,76,0.08)",
          }}
        >
          {/* Energy cycle */}
          <div>
            <p
              className="font-sans uppercase"
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.18em",
                color: "var(--muted)",
                marginBottom: "0.4rem",
              }}
            >
              Energy Cycle
            </p>
            <p
              className="font-sans"
              style={{ fontSize: "0.85rem", color: "var(--cream)" }}
            >
              {data.m ? `Every ${data.m}mo` : `${data.tps?.length ?? "—"} peaks`}
            </p>
          </div>

          {/* Current season */}
          <div>
            <p
              className="font-sans uppercase"
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.18em",
                color: "var(--muted)",
                marginBottom: "0.4rem",
              }}
            >
              Current Season
            </p>
            <p
              className="font-sans"
              style={{ fontSize: "0.85rem", color: "var(--cream)" }}
            >
              {seasonLabel ?? "—"}
            </p>
          </div>

          {/* Next turning point — blurred */}
          <div>
            <p
              className="font-sans uppercase"
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.18em",
                color: "var(--muted)",
                marginBottom: "0.4rem",
              }}
            >
              Next Pivot
            </p>
            <p
              className="font-sans"
              style={{
                fontSize: "0.85rem",
                color: "var(--gold)",
                filter: "blur(5px)",
                userSelect: "none",
              }}
              aria-hidden="true"
            >
              {data.y ?? "2027"}
            </p>
          </div>
        </div>

        {/* ── Section 4: Pattern Warning teaser ── */}
        <div
          style={{
            padding: "1.25rem",
            marginBottom: "2.5rem",
            background: "rgba(139,74,47,0.04)",
            border: "1px solid rgba(139,74,47,0.12)",
            borderLeft: "2px solid rgba(139,74,47,0.35)",
          }}
        >
          <p
            className="font-sans uppercase"
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "#8b4a2f",
              marginBottom: "0.75rem",
            }}
          >
            Pattern Warning
          </p>

          <div
            style={{
              filter: "blur(6px)",
              userSelect: "none",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <p
              className="font-sans font-light"
              style={{
                fontSize: "0.8125rem",
                lineHeight: 1.65,
                color: "var(--warm)",
              }}
            >
              There is a specific behavior embedded in this pattern — one that
              resets progress at every high-energy peak. It doesn&apos;t feel
              like self-sabotage in the moment. It appears as something
              reasonable. It has shaped every turning point in this record.
            </p>
          </div>

          <p
            className="font-sans"
            style={{
              fontSize: "0.7rem",
              color: "var(--muted)",
              marginTop: "0.75rem",
              letterSpacing: "0.04em",
            }}
          >
            Unlocked in the full report.
          </p>
        </div>

        {/* ── Section 5: Transition ── */}
        <div
          style={{
            borderTop: "1px solid rgba(201,168,76,0.12)",
            paddingTop: "2rem",
            marginBottom: "2rem",
          }}
        >
          <p
            className="font-serif font-light"
            style={{
              fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)",
              lineHeight: 1.45,
              color: "var(--cream)",
              marginBottom: "0.5rem",
            }}
          >
            &ldquo;{data.n}&rdquo; is a Seyrn life pattern analysis.
          </p>
          <p
            className="font-serif font-light"
            style={{
              fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)",
              lineHeight: 1.45,
              color: "var(--muted)",
            }}
          >
            Every life has a pattern. Most people never see theirs.
          </p>
        </div>

        {/* ── Section 6: CTA ── */}
        <Link
          href="/onboarding"
          style={{
            display: "block",
            width: "100%",
            background: "var(--gold)",
            color: "var(--ink)",
            fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            textAlign: "center",
            padding: "1rem 2rem",
            textDecoration: "none",
            transition: "background 0.15s",
          }}
        >
          Analyze your own pattern →
        </Link>

        <p
          className="font-sans text-center"
          style={{
            fontSize: "0.7rem",
            color: "var(--muted)",
            marginTop: "0.75rem",
            letterSpacing: "0.04em",
          }}
        >
          Takes 10 minutes. No account required.
        </p>
      </div>
    </main>
  );
}
