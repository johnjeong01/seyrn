"use client";

import { useRef, useState, useCallback } from "react";
import type { ReportData } from "@/lib/report-types";
import type { TurningPoint } from "@/lib/onboarding-types";

interface Props {
  report: ReportData;
  turningPoints: TurningPoint[];
}

const W = 1200;
const H = 630;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 2
): number {
  const words = text.split(" ");
  let line = "";
  let linesDrawn = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, y + linesDrawn * lineHeight);
      linesDrawn++;
      if (linesDrawn >= maxLines) return linesDrawn;
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, y + linesDrawn * lineHeight);
    linesDrawn++;
  }
  return linesDrawn;
}

function drawWaveform(
  ctx: CanvasRenderingContext2D,
  turningPoints: TurningPoint[]
) {
  const pts = turningPoints
    .filter((tp) => tp.year !== null)
    .sort((a, b) => (a.year as number) - (b.year as number));

  if (pts.length < 2) return;

  const years = pts.map((tp) => tp.year as number);
  const minYear = years[0];
  const maxYear = years[years.length - 1];
  const yearRange = Math.max(maxYear - minYear, 1);

  const xLeft = 680;
  const xRight = 1140;
  const yTop = 140;
  const yBottom = 500;

  function toX(year: number) {
    return xLeft + ((year - minYear) / yearRange) * (xRight - xLeft);
  }
  function toY(energy: number) {
    // energy 1-10: high energy = top, low energy = bottom
    return yBottom - ((energy - 1) / 9) * (yBottom - yTop);
  }

  const points = pts.map((tp) => ({
    x: toX(tp.year as number),
    y: toY(tp.energyLevel),
    energy: tp.energyLevel,
  }));

  // Draw smooth curve
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX = (curr.x + next.x) / 2;
    ctx.bezierCurveTo(cpX, curr.y, cpX, next.y, next.x, next.y);
  }

  ctx.strokeStyle = "rgba(201,168,76,0.35)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Draw dots
  for (const pt of points) {
    const dotColor =
      pt.energy >= 7 ? "#4a6355" : pt.energy <= 4 ? "#8b4a2f" : "#c9a84c";

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();

    // Subtle glow ring
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
    ctx.strokeStyle = dotColor.replace(")", ", 0.25)").replace("rgb", "rgba");
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

async function buildCardDataUrl(
  canvas: HTMLCanvasElement,
  report: ReportData,
  turningPoints: TurningPoint[]
): Promise<string> {
  await document.fonts.ready;

  canvas.width = W * 2;
  canvas.height = H * 2;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);

  // Background
  ctx.fillStyle = "#0f0e0c";
  ctx.fillRect(0, 0, W, H);

  // Gold top border
  ctx.fillStyle = "#c9a84c";
  ctx.fillRect(0, 0, W, 2);

  // Subtle vertical separator between text and waveform
  ctx.fillStyle = "rgba(201,168,76,0.08)";
  ctx.fillRect(660, 20, 1, H - 40);

  // Logo "SEYRN"
  ctx.font = "500 11px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#c9a84c";
  ctx.letterSpacing = "3px";
  ctx.fillText("SEYRN", 60, 56);
  ctx.letterSpacing = "0px";

  // Pattern name
  const nameText =
    report.pattern_name.length > 26
      ? report.pattern_name.slice(0, 24) + "…"
      : report.pattern_name;
  ctx.font = "300 62px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "#f5f0e8";
  ctx.fillText(nameText, 60, 210);

  // Thin gold underline below name
  ctx.fillStyle = "rgba(201,168,76,0.4)";
  const nameWidth = ctx.measureText(nameText).width;
  ctx.fillRect(60, 222, Math.min(nameWidth, 560), 1);

  // Archetype
  ctx.font = "300 17px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#7a7268";
  wrapText(ctx, report.pattern_archetype, 60, 258, 560, 26, 2);

  // Predicted year teaser
  const predictedYear = report.sections.next_turning_point.predicted_year;
  ctx.font = "300 13px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#c9a84c";
  ctx.fillText(`Next turning point: ~${predictedYear}`, 60, 340);

  // Waveform
  drawWaveform(ctx, turningPoints);

  // Bottom border line
  ctx.fillStyle = "rgba(201,168,76,0.15)";
  ctx.fillRect(0, H - 48, W, 1);

  // Domain
  ctx.font = "300 12px 'DM Sans', system-ui, sans-serif";
  ctx.fillStyle = "#7a7268";
  ctx.fillText("seyrn.app", 60, H - 20);

  return canvas.toDataURL("image/png");
}

export default function ShareCard({ report, turningPoints }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const canShare =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function";

  const handleShare = useCallback(async () => {
    if (!canvasRef.current) return;
    setGenerating(true);
    try {
      const url = await buildCardDataUrl(canvasRef.current, report, turningPoints);
      setImageUrl(url);
      setModalOpen(true);
    } finally {
      setGenerating(false);
    }
  }, [report, turningPoints]);

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "seyrn-pattern.png";
    a.click();
  }, [imageUrl]);

  const handleNativeShare = useCallback(async () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "seyrn-pattern.png", { type: "image/png" });
      try {
        await navigator.share({
          files: [file],
          title: report.pattern_name,
          text: report.pattern_archetype,
        });
      } catch {
        // User cancelled or share failed — silent
      }
    }, "image/png");
  }, [report]);

  return (
    <>
      {/* Share button + tagline */}
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
          onMouseEnter={(e) => {
            if (!generating)
              e.currentTarget.style.background = "rgba(245,240,232,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {generating ? "Generating…" : "Share your pattern"}
        </button>
        <p
          className="font-sans text-xs mt-3"
          style={{ color: "var(--muted)" }}
        >
          Your pattern is unique. No two Seyrn patterns are alike.
        </p>
      </div>

      {/* Hidden canvas for drawing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Preview modal */}
      {modalOpen && imageUrl && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,14,12,0.9)",
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
              border: "1px solid rgba(201,168,76,0.2)",
              padding: "2rem",
              maxWidth: "600px",
              width: "100%",
              animation: "fadeUp 0.3s ease-out forwards",
            }}
          >
            {/* Card preview — data URL from canvas, cannot use next/image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Your life pattern card"
              style={{ width: "100%", display: "block", borderRadius: 1 }}
            />

            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1.5rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleDownload}
                className="font-sans text-xs tracking-widest uppercase transition-all"
                style={{
                  background: "var(--gold)",
                  color: "var(--ink)",
                  border: "none",
                  padding: "0.65rem 1.5rem",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--gold-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--gold)";
                }}
              >
                Download PNG
              </button>

              {canShare && (
                <button
                  onClick={handleNativeShare}
                  className="font-sans text-xs tracking-widest uppercase transition-all"
                  style={{
                    background: "transparent",
                    color: "var(--cream)",
                    border: "1px solid var(--cream)",
                    padding: "0.65rem 1.5rem",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(245,240,232,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Share
                </button>
              )}

              <button
                onClick={() => setModalOpen(false)}
                className="font-sans text-xs transition-colors"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer",
                  padding: "0.65rem 0.5rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--cream)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--muted)";
                }}
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
