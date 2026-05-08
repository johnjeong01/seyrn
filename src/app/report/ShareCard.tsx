"use client";

import { useRef, useState, useCallback } from "react";
import type { ReportData } from "@/lib/report-types";
import type { TurningPoint } from "@/lib/onboarding-types";

interface Props {
  report: ReportData;
  turningPoints: TurningPoint[];
  currentSeason?: string | null;
  firstName?: string | null;
}

const W = 1080;
const H = 1080;
const PAD = 68;

// ── Helpers ──────────────────────────────────────────────────────

function addGrain(ctx: CanvasRenderingContext2D) {
  for (let i = 0; i < 2200; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.006 + Math.random() * 0.03})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }
}

function avgIntervalMonths(tps: TurningPoint[]): number | null {
  const years = tps
    .filter((tp) => tp.year !== null)
    .map((tp) => tp.year as number)
    .sort((a, b) => a - b);
  if (years.length < 2) return null;
  return Math.round(((years[years.length - 1] - years[0]) / (years.length - 1)) * 12);
}

function drawRedaction(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = "rgba(201,168,76,0.05)";
  ctx.fillRect(x - 4, y - 2, w + 8, h + 4);
  ctx.fillStyle = "rgba(201,168,76,0.14)";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "rgba(201,168,76,0.26)";
  ctx.fillRect(x + 8, y + h * 0.25, w - 16, h * 0.35);
  ctx.fillStyle = "rgba(201,168,76,0.4)";
  ctx.fillRect(x + 14, y + h * 0.35, w - 28, h * 0.2);
}

function drawWaveform(
  ctx: CanvasRenderingContext2D,
  tps: TurningPoint[],
  xL: number,
  xR: number,
  yT: number,
  yB: number
) {
  const pts = tps
    .filter((tp) => tp.year !== null)
    .sort((a, b) => (a.year as number) - (b.year as number));
  if (pts.length < 1) return;

  const years = pts.map((tp) => tp.year as number);
  const minY = Math.min(...years);
  const maxY = Math.max(...years);
  const yr = Math.max(maxY - minY, 1);

  const toX = (y: number) => xL + ((y - minY) / yr) * (xR - xL);
  const toYc = (e: number) => yB - ((e - 1) / 9) * (yB - yT);

  const points = pts.map((tp) => ({
    x: toX(tp.year as number),
    y: toYc(tp.energyLevel),
    e: tp.energyLevel,
  }));

  if (points.length >= 2) {
    // Filled area
    ctx.beginPath();
    ctx.moveTo(points[0].x, yB);
    ctx.lineTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const cpX = (points[i].x + points[i + 1].x) / 2;
      ctx.bezierCurveTo(cpX, points[i].y, cpX, points[i + 1].y, points[i + 1].x, points[i + 1].y);
    }
    ctx.lineTo(points[points.length - 1].x, yB);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, yT, 0, yB);
    g.addColorStop(0, "rgba(201,168,76,0.055)");
    g.addColorStop(1, "rgba(201,168,76,0.008)");
    ctx.fillStyle = g;
    ctx.fill();

    // Stroke
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const cpX = (points[i].x + points[i + 1].x) / 2;
      ctx.bezierCurveTo(cpX, points[i].y, cpX, points[i + 1].y, points[i + 1].x, points[i + 1].y);
    }
    ctx.strokeStyle = "rgba(201,168,76,0.48)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Dots
  points.forEach((pt, idx) => {
    const isLast = idx === points.length - 1;
    const col = pt.e >= 7 ? "#4a6355" : pt.e <= 4 ? "#8b4a2f" : "#c9a84c";
    const dotCol = isLast ? "#c9a84c" : col;

    if (isLast) {
      for (let r = 3; r >= 0; r--) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 7 + r * 9, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(201,168,76,${0.055 - r * 0.011})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, isLast ? 6 : 4.5, 0, Math.PI * 2);
    ctx.fillStyle = dotCol;
    ctx.fill();

    if (!isLast) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.strokeStyle = `${col}44`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  });
}

function fitName(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  maxH: number
): { lines: string[]; size: number } {
  const words = text.split(" ");
  for (let size = 148; size >= 36; size -= 4) {
    ctx.font = `300 ${size}px 'Cormorant Garamond', Georgia, serif`;
    const lh = size * 1.12;
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      const t = cur ? `${cur} ${w}` : w;
      if (ctx.measureText(t).width > maxW && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = t;
      }
    }
    if (cur) lines.push(cur);
    if (
      lines.every((l) => ctx.measureText(l).width <= maxW) &&
      lines.length <= 3 &&
      lines.length * lh <= maxH
    ) {
      return { lines, size };
    }
  }
  return { lines: [text.slice(0, 22)], size: 36 };
}

// ── Share data ────────────────────────────────────────────────────

interface ShareData {
  n: string;
  a: string;
  s: [string, string] | ["", ""];
  y?: number;
  m: number | null;
  sea: string | null;
  tps: Array<{ yr: number; e: number }>;
  fn?: string; // firstName
}

function buildShareData(
  report: ReportData,
  tps: TurningPoint[],
  season: string | null,
  firstName?: string | null
): ShareData {
  return {
    n: report.pattern_name,
    a: report.pattern_archetype.slice(0, 120),
    s: report.share_sentences ?? ["", ""],
    y: undefined,
    m: avgIntervalMonths(tps),
    sea: season,
    tps: tps
      .filter((tp) => tp.year !== null)
      .map((tp) => ({ yr: tp.year as number, e: tp.energyLevel })),
    fn: firstName || undefined,
  };
}

function buildShareUrl(data: ShareData): string {
  const encoded = encodeURIComponent(JSON.stringify(data));
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://seyrn.app";
  return `${origin}/r?d=${encoded}`;
}

// ── Canvas card builder ──────────────────────────────────────────

async function buildCard(
  canvas: HTMLCanvasElement,
  report: ReportData,
  tps: TurningPoint[],
  season: string | null
): Promise<string> {
  await document.fonts.ready;
  canvas.width = W * 2;
  canvas.height = H * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);

  type ExtCtx = CanvasRenderingContext2D & { letterSpacing: string };
  const setLS = (v: string) => {
    try {
      (ctx as ExtCtx).letterSpacing = v;
    } catch {
      /* noop */
    }
  };

  // Background
  ctx.fillStyle = "#0f0e0c";
  ctx.fillRect(0, 0, W, H);
  addGrain(ctx);

  // Gold top border (2px)
  ctx.fillStyle = "#c9a84c";
  ctx.fillRect(0, 0, W, 2);

  // ── SEYRN wordmark ──
  ctx.fillStyle = "#c9a84c";
  ctx.font = "500 11px 'DM Sans', system-ui, sans-serif";
  setLS("0.32em");
  ctx.fillText("SEYRN", PAD, 52);
  setLS("0px");

  // Thin separator
  ctx.fillStyle = "rgba(201,168,76,0.18)";
  ctx.fillRect(PAD, 67, W - PAD * 2, 1);

  // ── YOUR LIFE PATTERN ──
  ctx.font = "300 10px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#7a7268";
  setLS("0.35em");
  ctx.fillText("YOUR LIFE PATTERN", PAD, 90);
  setLS("0px");

  // ── Pattern name (zone: y=116 → y=392, 276px) ──
  const maxNameW = W - PAD * 2;
  const { lines, size } = fitName(ctx, report.pattern_name, maxNameW, 272);
  const lh = size * 1.12;
  ctx.save();
  ctx.shadowColor = "rgba(201,168,76,0.28)";
  ctx.shadowBlur = 44;
  ctx.fillStyle = "#f5f0e8";
  ctx.font = `300 ${size}px 'Cormorant Garamond', Georgia, serif`;
  const nameStartY = 116 + size;
  lines.forEach((line, i) => ctx.fillText(line, PAD, nameStartY + i * lh));
  ctx.restore();

  // ── Archetype ──
  ctx.font = "300 15px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#7a7268";
  const arch =
    report.pattern_archetype.length > 88
      ? report.pattern_archetype.slice(0, 85) + "…"
      : report.pattern_archetype;
  ctx.fillText(arch, PAD, 422);

  // ── Waveform (y=460 → y=610) ──
  drawWaveform(ctx, tps, PAD, W - PAD, 460, 610);

  // ── Gold separator ──
  ctx.fillStyle = "rgba(201,168,76,0.14)";
  ctx.fillRect(PAD, 636, W - PAD * 2, 1);

  // ── Share sentences ──
  const s = report.share_sentences;
  if (s && s[0] && s[1]) {
    ctx.save();
    ctx.font = "italic 300 20px 'Cormorant Garamond', Georgia, serif";
    // Truncate so it won't overflow the canvas width
    const maxSentW = W - PAD * 2 - 10;
    const trunc = (t: string, limit: number) =>
      ctx.measureText(t).width > limit ? t.slice(0, 78) + "…" : t;

    ctx.fillStyle = "#f5f0e8";
    ctx.fillText(`"${trunc(s[0], maxSentW)}"`, PAD, 682);
    ctx.fillStyle = "#e8dfd0";
    ctx.fillText(`"${trunc(s[1], maxSentW)}"`, PAD, 726);
    ctx.restore();
  } else {
    // Fallback
    ctx.save();
    ctx.font = "italic 300 20px 'Cormorant Garamond', Georgia, serif";
    ctx.fillStyle = "#f5f0e8";
    ctx.fillText(`"${arch}"`, PAD, 704);
    ctx.restore();
  }

  // ── Data row ──
  const months = avgIntervalMonths(tps);
  const validCount = tps.filter((tp) => tp.year !== null).length;
  const cycleVal = months ? `Every ${months} months` : `${validCount} turning points`;
  const seasonVal = season
    ? season.charAt(0).toUpperCase() + season.slice(1)
    : null;

  // Left: energy cycle
  ctx.font = "300 9px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#7a7268";
  setLS("0.18em");
  ctx.fillText("ENERGY CYCLE", PAD, 782);
  setLS("0px");
  ctx.font = "300 14px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#f5f0e8";
  ctx.fillText(cycleVal, PAD, 802);

  // Right: current season
  if (seasonVal) {
    const rightX = PAD + 360;
    ctx.font = "300 9px 'DM Sans', system-ui, sans-serif";
    ctx.fillStyle = "#7a7268";
    setLS("0.18em");
    ctx.fillText("CURRENT SEASON", rightX, 782);
    setLS("0px");
    ctx.font = "300 14px 'DM Sans', system-ui, sans-serif";
    ctx.fillStyle = "#f5f0e8";
    ctx.fillText(seasonVal, rightX, 802);
  }

  // ── NEXT TURNING POINT (redacted) ──
  ctx.font = "300 9px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#7a7268";
  setLS("0.18em");
  ctx.fillText("NEXT TURNING POINT", PAD, 850);
  setLS("0px");
  drawRedaction(ctx, PAD, 860, 260, 24);

  // ── PATTERN WARNING (redacted) ──
  ctx.font = "300 9px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#7a7268";
  setLS("0.18em");
  ctx.fillText("PATTERN WARNING", PAD, 912);
  setLS("0px");
  drawRedaction(ctx, PAD, 922, 220, 24);

  // ── Footer separator ──
  ctx.fillStyle = "rgba(201,168,76,0.11)";
  ctx.fillRect(PAD, 984, W - PAD * 2, 1);

  // ── Footer ──
  ctx.font = "300 13px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#7a7268";
  ctx.fillText("seyrn.app", PAD, 1030);

  ctx.font = "italic 300 18px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "#c9a84c";
  const tagW = ctx.measureText("What's yours?").width;
  ctx.fillText("What's yours?", W - PAD - tagW, 1030);

  return canvas.toDataURL("image/png");
}

// ── Component ────────────────────────────────────────────────────

export default function ShareCard({ report, turningPoints, currentSeason, firstName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cachedUrlRef = useRef<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "loading" | "copied">("idle");
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);

  const resolveShareUrl = useCallback(async (): Promise<string> => {
    if (cachedUrlRef.current) return cachedUrlRef.current;
    const origin = window.location.origin;
    let reportId: string | null = null;
    try { reportId = localStorage.getItem("seyrn-report-id"); } catch { /* ignore */ }
    if (reportId) {
      try {
        const res = await fetch("/api/reports/share-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reportId }),
        });
        if (res.ok) {
          const body = await res.json() as { shareToken?: string };
          if (body.shareToken) {
            const url = `${origin}/s/${body.shareToken}`;
            cachedUrlRef.current = url;
            setDisplayUrl(url);
            return url;
          }
        }
      } catch { /* fallback */ }
    }
    // Fallback to encoded URL
    const url = buildShareUrl(buildShareData(report, turningPoints, currentSeason ?? null, firstName));
    cachedUrlRef.current = url;
    return url;
  }, [report, turningPoints, currentSeason, firstName]);

  const handleOpen = useCallback(async () => {
    if (!canvasRef.current) return;
    setGenerating(true);
    try {
      const url = await buildCard(canvasRef.current, report, turningPoints, currentSeason ?? null);
      setImageUrl(url);
      setModalOpen(true);
    } finally {
      setGenerating(false);
    }
  }, [report, turningPoints, currentSeason]);

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "seyrn-pattern.png";
    a.click();
  }, [imageUrl]);

  const handleCopyLink = useCallback(async () => {
    setCopyState("loading");
    try {
      const url = await resolveShareUrl();
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2200);
    } catch {
      setCopyState("idle");
    }
  }, [resolveShareUrl]);

  const handleShareX = useCallback(async () => {
    const url = await resolveShareUrl();
    const text = `My life pattern: "${report.pattern_name}" — ${report.pattern_archetype.slice(0, 80)}\n\nFind yours:`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [resolveShareUrl, report]);

  const isCopied = copyState === "copied";
  const isCopyLoading = copyState === "loading";

  const btnBase: React.CSSProperties = {
    fontFamily: "inherit",
    fontSize: "0.65rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    padding: "0.65rem 1.25rem",
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
    whiteSpace: "nowrap",
  };

  return (
    <>
      <div className="text-center mt-10">
        <button
          onClick={handleOpen}
          disabled={generating}
          className="font-sans text-xs tracking-widest uppercase transition-all"
          style={{
            border: "1px solid var(--cream)",
            color: generating ? "var(--muted)" : "var(--cream)",
            background: "transparent",
            padding: "0.75rem 2.5rem",
            cursor: generating ? "wait" : "pointer",
            letterSpacing: "0.14em",
          }}
          onMouseEnter={(e) => {
            if (!generating) e.currentTarget.style.background = "rgba(245,240,232,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {generating ? "Generating…" : "Share your pattern"}
        </button>
        <p className="font-sans text-xs mt-3" style={{ color: "var(--muted)" }}>
          Your pattern is unique. No two Seyrn patterns are alike.
        </p>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Copied toast */}
      {isCopied && (
        <div
          style={{
            position: "fixed",
            bottom: "5rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--deep)",
            border: "1px solid rgba(201,168,76,0.3)",
            padding: "0.6rem 1.5rem",
            zIndex: 200,
            animation: "fadeUp 0.25s ease-out forwards",
          }}
        >
          <p className="font-sans text-xs tracking-widest uppercase" style={{ color: "var(--gold)" }}>
            Link copied
          </p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && imageUrl && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,14,12,0.94)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div
            style={{
              background: "var(--deep)",
              border: "1px solid rgba(201,168,76,0.18)",
              padding: "1.75rem",
              maxWidth: "520px",
              width: "100%",
              animation: "fadeUp 0.3s ease-out forwards",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Your life pattern card"
              style={{ width: "100%", display: "block", borderRadius: 1 }}
            />

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginTop: "1.25rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Download PNG */}
              <button
                onClick={handleDownload}
                className="font-sans"
                style={{ ...btnBase, background: "var(--gold)", color: "var(--ink)", border: "none", fontWeight: 500 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold-light)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--gold)"; }}
              >
                Download PNG
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                disabled={isCopyLoading}
                className="font-sans"
                style={{
                  ...btnBase,
                  background: "transparent",
                  color: isCopied ? "var(--gold)" : isCopyLoading ? "var(--muted)" : "var(--cream)",
                  border: `1px solid ${isCopied ? "var(--gold)" : "rgba(245,240,232,0.35)"}`,
                  cursor: isCopyLoading ? "wait" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isCopied && !isCopyLoading) e.currentTarget.style.background = "rgba(245,240,232,0.07)";
                }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {isCopied ? "Copied!" : isCopyLoading ? "Getting link…" : "Copy Link"}
              </button>

              {/* Share to X */}
              <button
                onClick={handleShareX}
                className="font-sans"
                style={{ ...btnBase, background: "transparent", color: "var(--muted)", border: "1px solid rgba(255,255,255,0.1)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cream)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                Share to X
              </button>

              {/* Close */}
              <button
                onClick={() => setModalOpen(false)}
                className="font-sans"
                style={{ ...btnBase, background: "transparent", color: "var(--muted)", border: "1px solid rgba(255,255,255,0.1)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cream)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                Close
              </button>
            </div>

            {/* Link preview */}
            {displayUrl && (
              <p
                className="font-sans text-center mt-4"
                style={{ color: "var(--muted)", fontSize: "0.6rem", letterSpacing: "0.05em" }}
              >
                {displayUrl}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
