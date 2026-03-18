import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

interface ShareData {
  n?: string;
  a?: string;
  s?: [string, string];
  y?: number;
  m?: number | null;
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
  const s1 = data.s?.[0] ? `"${data.s[0].slice(0, 72)}"` : "";
  const s2 = data.s?.[1] ? `"${data.s[1].slice(0, 72)}"` : "";

  // Font size for name: scale down for longer names
  const nameFontSize = name.length > 28 ? 52 : name.length > 18 ? 66 : 80;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0f0e0c",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gold top border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "#c9a84c",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            padding: "52px 72px 0 72px",
          }}
        >
          {/* SEYRN */}
          <div
            style={{
              color: "#c9a84c",
              fontSize: 11,
              fontFamily: "sans-serif",
              letterSpacing: "0.3em",
              marginBottom: 20,
              textTransform: "uppercase",
            }}
          >
            SEYRN
          </div>

          {/* YOUR LIFE PATTERN */}
          <div
            style={{
              color: "#7a7268",
              fontSize: 10,
              fontFamily: "sans-serif",
              letterSpacing: "0.35em",
              marginBottom: 24,
              textTransform: "uppercase",
            }}
          >
            YOUR LIFE PATTERN
          </div>

          {/* Pattern name */}
          <div
            style={{
              color: "#f5f0e8",
              fontFamily: "Georgia, serif",
              fontSize: nameFontSize,
              fontWeight: 300,
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            {name}
          </div>

          {/* Archetype */}
          {arch && (
            <div
              style={{
                color: "#7a7268",
                fontFamily: "sans-serif",
                fontSize: 16,
                marginBottom: 28,
              }}
            >
              {arch}
            </div>
          )}

          {/* Share sentences */}
          {s1 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                borderLeft: "2px solid rgba(201,168,76,0.3)",
                paddingLeft: 20,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  color: "#f5f0e8",
                  fontFamily: "Georgia, serif",
                  fontSize: 18,
                  fontStyle: "italic",
                }}
              >
                {s1}
              </div>
              {s2 && (
                <div
                  style={{
                    color: "#e8dfd0",
                    fontFamily: "Georgia, serif",
                    fontSize: 18,
                    fontStyle: "italic",
                  }}
                >
                  {s2}
                </div>
              )}
            </div>
          )}

          {/* Next TP year */}
          {year && (
            <div
              style={{
                color: "#c9a84c",
                fontFamily: "sans-serif",
                fontSize: 13,
              }}
            >
              Next turning point: ~{year}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 72px",
            borderTop: "1px solid rgba(201,168,76,0.1)",
          }}
        >
          <div
            style={{
              color: "#7a7268",
              fontFamily: "sans-serif",
              fontSize: 13,
            }}
          >
            seyrn.app
          </div>
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
    { width: 1200, height: 630 }
  );
}
