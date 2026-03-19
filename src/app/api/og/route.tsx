import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

interface ShareData {
  n?: string;
  a?: string;
  s?: [string, string];
  y?: number;
  m?: number | null;
  tps?: Array<{ yr: number; e: number }>;
}

export async function GET(req: NextRequest) {
  const d = req.nextUrl.searchParams.get("d");

  let data: ShareData = {};
  if (d) {
    try {
      data = JSON.parse(decodeURIComponent(d)) as ShareData;
    } catch {
      /* use defaults */
    }
  }

  const name = data.n ?? "Your Life Pattern";
  const arch = (data.a ?? "").slice(0, 90);
  const year = data.y;
  const s1 = data.s?.[0] ? `"${data.s[0].slice(0, 68)}"` : "";
  const s2 = data.s?.[1] ? `"${data.s[1].slice(0, 68)}"` : "";
  const months = data.m;
  const tpCount = data.tps?.length ?? 0;

  // Scale name font size to length
  const nameFontSize = name.length > 28 ? 58 : name.length > 18 ? 72 : 88;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1080,
          background: "#0f0e0c",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Gold top border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "#c9a84c",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "64px 72px 0 72px",
          }}
        >
          {/* SEYRN wordmark */}
          <div
            style={{
              color: "#c9a84c",
              fontSize: 11,
              letterSpacing: "0.3em",
              marginBottom: 18,
            }}
          >
            SEYRN
          </div>

          {/* Separator */}
          <div
            style={{
              height: 1,
              background: "rgba(201,168,76,0.18)",
              marginBottom: 22,
            }}
          />

          {/* YOUR LIFE PATTERN */}
          <div
            style={{
              color: "#7a7268",
              fontSize: 10,
              letterSpacing: "0.35em",
              marginBottom: 28,
            }}
          >
            YOUR LIFE PATTERN
          </div>

          {/* Pattern name */}
          <div
            style={{
              color: "#f5f0e8",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: nameFontSize,
              fontWeight: 300,
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            {name}
          </div>

          {/* Archetype */}
          {arch && (
            <div
              style={{
                color: "#7a7268",
                fontSize: 15,
                marginBottom: 36,
                lineHeight: 1.5,
              }}
            >
              {arch}
            </div>
          )}

          {/* Share sentences */}
          {(s1 || s2) && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                borderLeft: "2px solid rgba(201,168,76,0.3)",
                paddingLeft: 22,
                marginBottom: 36,
              }}
            >
              {s1 && (
                <div
                  style={{
                    color: "#f5f0e8",
                    fontFamily: "Georgia, serif",
                    fontSize: 19,
                    fontStyle: "italic",
                    lineHeight: 1.45,
                  }}
                >
                  {s1}
                </div>
              )}
              {s2 && (
                <div
                  style={{
                    color: "#e8dfd0",
                    fontFamily: "Georgia, serif",
                    fontSize: 19,
                    fontStyle: "italic",
                    lineHeight: 1.45,
                  }}
                >
                  {s2}
                </div>
              )}
            </div>
          )}

          {/* Data row */}
          <div
            style={{
              display: "flex",
              gap: 48,
              marginBottom: 32,
            }}
          >
            {months && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ color: "#7a7268", fontSize: 9, letterSpacing: "0.18em" }}>
                  ENERGY CYCLE
                </div>
                <div style={{ color: "#f5f0e8", fontSize: 14 }}>
                  Every {months} months
                </div>
              </div>
            )}
            {!months && tpCount > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ color: "#7a7268", fontSize: 9, letterSpacing: "0.18em" }}>
                  TURNING POINTS
                </div>
                <div style={{ color: "#f5f0e8", fontSize: 14 }}>
                  {tpCount} recorded
                </div>
              </div>
            )}
            {year && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ color: "#7a7268", fontSize: 9, letterSpacing: "0.18em" }}>
                  NEXT TURNING POINT
                </div>
                <div style={{ color: "#c9a84c", fontSize: 14 }}>
                  ~{year}
                </div>
              </div>
            )}
          </div>

          {/* Redacted rows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ color: "#7a7268", fontSize: 9, letterSpacing: "0.18em" }}>
                PATTERN WARNING
              </div>
              <div
                style={{
                  height: 22,
                  width: 220,
                  background: "rgba(201,168,76,0.18)",
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 72px",
            borderTop: "1px solid rgba(201,168,76,0.1)",
          }}
        >
          <div style={{ color: "#7a7268", fontSize: 13 }}>seyrn.app</div>
          <div
            style={{
              color: "#c9a84c",
              fontFamily: "Georgia, serif",
              fontSize: 17,
              fontStyle: "italic",
            }}
          >
            What&apos;s yours?
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  );
}
