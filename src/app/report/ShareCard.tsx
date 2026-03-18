"use client";

import { useRef, useState, useCallback } from "react";
import type { ReportData } from "@/lib/report-types";
import type { TurningPoint } from "@/lib/onboarding-types";

interface Props {
  report: ReportData;
  turningPoints: TurningPoint[];
}

const SQ = 1080; // Square (Instagram)
const LW = 1200; // Landscape width (Twitter/OG)
const LH = 630;  // Landscape height

// ── Helpers ─────────────────────────────────────────────────────

function addGrain(ctx: CanvasRenderingContext2D, W: number, H: number) {
  for (let i = 0; i < 1800; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.01 + Math.random() * 0.04})`;
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
  ctx.fillStyle = "rgba(201,168,76,0.07)";
  ctx.fillRect(x - 4, y - 2, w + 8, h + 4);
  ctx.fillStyle = "rgba(201,168,76,0.18)";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "rgba(201,168,76,0.32)";
  ctx.fillRect(x + 6, y + h * 0.25, w - 12, h * 0.35);
  ctx.fillStyle = "rgba(201,168,76,0.48)";
  ctx.fillRect(x + 10, y + h * 0.35, w - 20, h * 0.2);
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
    g.addColorStop(0, "rgba(201,168,76,0.07)");
    g.addColorStop(1, "rgba(201,168,76,0.01)");
    ctx.fillStyle = g;
    ctx.fill();

    // Stroke
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const cpX = (points[i].x + points[i + 1].x) / 2;
      ctx.bezierCurveTo(cpX, points[i].y, cpX, points[i + 1].y, points[i + 1].x, points[i + 1].y);
    }
    ctx.strokeStyle = "rgba(201,168,76,0.55)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Dots
  points.forEach((pt, idx) => {
    const isLast = idx === points.length - 1;
    const col = pt.e >= 7 ? "#4a6355" : pt.e <= 4 ? "#8b4a2f" : "#c9a84c";
    const dotCol = isLast ? "#c9a84c" : col;

    if (isLast) {
      // Glow rings
      for (let r = 3; r >= 0; r--) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 6 + r * 8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(201,168,76,${0.05 - r * 0.01})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = dotCol;
    ctx.fill();

    if (!isLast) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 9, 0, Math.PI * 2);
      ctx.strokeStyle = `${col}55`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  });
}

/** Auto-fits pattern name into maxWidth, returns {lines, size} */
function fitName(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  maxH: number
): { lines: string[]; size: number } {
  const words = text.split(" ");
  for (let size = 160; size >= 40; size -= 4) {
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
    const fit =
      lines.every((l) => ctx.measureText(l).width <= maxW) &&
      lines.length <= 3 &&
      lines.length * lh <= maxH;
    if (fit) return { lines, size };
  }
  return { lines: [text.slice(0, 22)], size: 40 };
}

// ── Square card (1080×1080) ─────────────────────────────────────

async function buildSquareCard(
  canvas: HTMLCanvasElement,
  report: ReportData,
  tps: TurningPoint[]
): Promise<string> {
  await document.fonts.ready;
  const W = SQ, H = SQ, PAD = 64;

  canvas.width = W * 2;
  canvas.height = H * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);

  // Background
  ctx.fillStyle = "#1a1814";
  ctx.fillRect(0, 0, W, H);

  // Grain
  addGrain(ctx, W, H);

  // Wordmark
  ctx.fillStyle = "#c9a84c";
  ctx.font = "500 11px 'DM Sans', system-ui, sans-serif";
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0.32em"; } catch { /* noop */ }
  ctx.fillText("SEYRN", PAD, 50);
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px"; } catch { /* noop */ }

  // Gold separator below wordmark
  ctx.fillStyle = "rgba(201,168,76,0.22)";
  ctx.fillRect(PAD, 64, W - PAD * 2, 1);

  // Label
  ctx.font = "300 10px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#7a7268";
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0.35em"; } catch { /* noop */ }
  ctx.fillText("YOUR LIFE PATTERN", PAD, 90);
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px"; } catch { /* noop */ }

  // Pattern name
  const maxNameW = W - PAD * 2;
  const maxNameH = 340; // name zone height
  const { lines, size } = fitName(ctx, report.pattern_name, maxNameW, maxNameH);
  const lh = size * 1.12;

  ctx.save();
  ctx.shadowColor = "rgba(201,168,76,0.22)";
  ctx.shadowBlur = 36;
  ctx.fillStyle = "#f5f0e8";
  ctx.font = `300 ${size}px 'Cormorant Garamond', Georgia, serif`;
  const nameStartY = 120 + size;
  lines.forEach((line, i) => ctx.fillText(line, PAD, nameStartY + i * lh));
  ctx.restore();

  // Waveform
  const waveTop = 520;
  const waveBot = 700;
  drawWaveform(ctx, tps, PAD, W - PAD, waveTop, waveBot);

  // Separator
  ctx.fillStyle = "rgba(201,168,76,0.15)";
  ctx.fillRect(PAD, 728, W - PAD * 2, 1);

  // Stat line
  const months = avgIntervalMonths(tps);
  const validCount = tps.filter((tp) => tp.year !== null).length;
  const statText = months
    ? `Energy peaks every ${months} months.`
    : `${validCount} turning points. One pattern.`;
  ctx.font = "300 17px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#f5f0e8";
  ctx.fillText(statText, PAD, 772);

  // Next turning point — redacted
  ctx.font = "300 10px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#7a7268";
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0.18em"; } catch { /* noop */ }
  ctx.fillText("NEXT TURNING POINT", PAD, 820);
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px"; } catch { /* noop */ }
  drawRedaction(ctx, PAD, 830, 92, 22);

  // Footer line
  ctx.fillStyle = "rgba(201,168,76,0.12)";
  ctx.fillRect(PAD, H - 54, W - PAD * 2, 1);

  // Footer text
  ctx.font = "300 13px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#7a7268";
  ctx.fillText("seyrn.app", PAD, H - 24);

  ctx.font = "italic 300 18px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "#c9a84c";
  const tagW = ctx.measureText("What's yours?").width;
  ctx.fillText("What's yours?", W - PAD - tagW, H - 24);

  return canvas.toDataURL("image/png");
}

// ── Landscape card (1200×630) ───────────────────────────────────

async function buildLandscapeCard(
  canvas: HTMLCanvasElement,
  report: ReportData,
  tps: TurningPoint[]
): Promise<string> {
  await document.fonts.ready;
  const W = LW, H = LH, PAD = 56;

  canvas.width = W * 2;
  canvas.height = H * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);

  // Background
  ctx.fillStyle = "#1a1814";
  ctx.fillRect(0, 0, W, H);
  addGrain(ctx, W, H);

  // Vertical divider (left/right split at 54%)
  const split = Math.round(W * 0.54);
  ctx.fillStyle = "rgba(201,168,76,0.07)";
  ctx.fillRect(split, 20, 1, H - 40);

  // Wordmark
  ctx.fillStyle = "#c9a84c";
  ctx.font = "500 10px 'DM Sans', system-ui, sans-serif";
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0.3em"; } catch { /* noop */ }
  ctx.fillText("SEYRN", PAD, 44);
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px"; } catch { /* noop */ }

  ctx.fillStyle = "rgba(201,168,76,0.2)";
  ctx.fillRect(PAD, 56, split - PAD - 20, 1);

  // Label
  ctx.font = "300 9px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#7a7268";
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0.32em"; } catch { /* noop */ }
  ctx.fillText("YOUR LIFE PATTERN", PAD, 76);
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px"; } catch { /* noop */ }

  // Pattern name
  const maxNameW = split - PAD - 24;
  const { lines, size } = fitName(ctx, report.pattern_name, maxNameW, 280);
  const lh = size * 1.1;
  ctx.save();
  ctx.shadowColor = "rgba(201,168,76,0.2)";
  ctx.shadowBlur = 28;
  ctx.fillStyle = "#f5f0e8";
  ctx.font = `300 ${size}px 'Cormorant Garamond', Georgia, serif`;
  const nY = 96 + size;
  lines.forEach((l, i) => ctx.fillText(l, PAD, nY + i * lh));
  ctx.restore();

  // Stats (left side, below name)
  const months = avgIntervalMonths(tps);
  const validCount = tps.filter((tp) => tp.year !== null).length;
  const statText = months
    ? `Energy peaks every ${months} months.`
    : `${validCount} turning points. One pattern.`;
  ctx.font = "300 15px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#f5f0e8";
  ctx.fillText(statText, PAD, 480);

  // Redacted TP
  ctx.font = "300 9px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#7a7268";
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0.15em"; } catch { /* noop */ }
  ctx.fillText("NEXT TURNING POINT", PAD, 520);
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px"; } catch { /* noop */ }
  drawRedaction(ctx, PAD, 530, 80, 18);

  // Waveform (right side)
  drawWaveform(ctx, tps, split + 24, W - PAD, 100, 510);

  // Footer
  ctx.fillStyle = "rgba(201,168,76,0.12)";
  ctx.fillRect(PAD, H - 46, W - PAD * 2, 1);

  ctx.font = "300 12px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#7a7268";
  ctx.fillText("seyrn.app", PAD, H - 18);

  ctx.font = "italic 300 16px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "#c9a84c";
  const tw = ctx.measureText("What's yours?").width;
  ctx.fillText("What's yours?", W - PAD - tw, H - 18);

  return canvas.toDataURL("image/png");
}

// ── Component ───────────────────────────────────────────────────

export default function ShareCard({ report, turningPoints }: Props) {
  const squareRef = useRef<HTMLCanvasElement>(null);
  const landRef = useRef<HTMLCanvasElement>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [squareUrl, setSquareUrl] = useState<string | null>(null);
  const [landUrl, setLandUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [format, setFormat] = useState<"square" | "land">("square");

  const canShare =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function";

  const handleShare = useCallback(async () => {
    if (!squareRef.current || !landRef.current) return;
    setGenerating(true);
    try {
      const [sq, la] = await Promise.all([
        buildSquareCard(squareRef.current, report, turningPoints),
        buildLandscapeCard(landRef.current, report, turningPoints),
      ]);
      setSquareUrl(sq);
      setLandUrl(la);
      setModalOpen(true);
    } finally {
      setGenerating(false);
    }
  }, [report, turningPoints]);

  const handleDownload = useCallback(() => {
    const url = format === "square" ? squareUrl : landUrl;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = format === "square" ? "seyrn-pattern-1080.png" : "seyrn-pattern-1200x630.png";
    a.click();
  }, [format, squareUrl, landUrl]);

  const handleNativeShare = useCallback(async () => {
    const ref = format === "square" ? squareRef.current : landRef.current;
    if (!ref) return;
    ref.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "seyrn-pattern.png", { type: "image/png" });
      try {
        await navigator.share({ files: [file], title: report.pattern_name, text: report.pattern_archetype });
      } catch { /* cancelled */ }
    }, "image/png");
  }, [format, report]);

  const previewUrl = format === "square" ? squareUrl : landUrl;

  return (
    <>
      <div className="text-center mt-10">
        <button
          onClick={handleShare}
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
          onMouseEnter={(e) => { if (!generating) e.currentTarget.style.background = "rgba(245,240,232,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          {generating ? "Generating…" : "Share your pattern"}
        </button>
        <p className="font-sans text-xs mt-3" style={{ color: "var(--muted)" }}>
          Your pattern is unique. No two Seyrn patterns are alike.
        </p>
      </div>

      <canvas ref={squareRef} style={{ display: "none" }} />
      <canvas ref={landRef} style={{ display: "none" }} />

      {modalOpen && squareUrl && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(15,14,12,0.92)",
            zIndex: 100, display: "flex", alignItems: "center",
            justifyContent: "center", padding: "1.5rem",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div
            style={{
              background: "var(--deep)", border: "1px solid rgba(201,168,76,0.2)",
              padding: "2rem", maxWidth: "640px", width: "100%",
              animation: "fadeUp 0.3s ease-out forwards",
            }}
          >
            {/* Format toggle */}
            <div className="flex gap-2 mb-4" style={{ justifyContent: "center" }}>
              {(["square", "land"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className="font-sans text-xs tracking-widest uppercase"
                  style={{
                    padding: "0.35rem 1rem",
                    background: format === f ? "var(--gold)" : "transparent",
                    color: format === f ? "var(--ink)" : "var(--muted)",
                    border: format === f ? "none" : "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                  }}
                >
                  {f === "square" ? "1:1 Square" : "16:9 Landscape"}
                </button>
              ))}
            </div>

            {previewUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={previewUrl}
                alt="Your life pattern card"
                style={{ width: "100%", display: "block", borderRadius: 1 }}
              />
            )}

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={handleDownload}
                className="font-sans text-xs tracking-widest uppercase transition-all"
                style={{ background: "var(--gold)", color: "var(--ink)", border: "none", padding: "0.65rem 1.5rem", cursor: "pointer", fontWeight: 500 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold-light)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--gold)"; }}
              >
                Download PNG
              </button>

              {canShare && (
                <button
                  onClick={handleNativeShare}
                  className="font-sans text-xs tracking-widest uppercase transition-all"
                  style={{ background: "transparent", color: "var(--cream)", border: "1px solid var(--cream)", padding: "0.65rem 1.5rem", cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(245,240,232,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  Share
                </button>
              )}

              <button
                onClick={() => setModalOpen(false)}
                className="font-sans text-xs transition-colors"
                style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", padding: "0.65rem 0.5rem" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cream)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
