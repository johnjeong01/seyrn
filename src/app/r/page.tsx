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
}

function decode(d: string): ShareData | null {
  try {
    return JSON.parse(decodeURIComponent(d)) as ShareData;
  } catch {
    return null;
  }
}

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
  const description = data.a;
  const ogUrl = `/api/og?d=${encodeURIComponent(d)}`;

  return {
    title,
    description,
    openGraph: {
      title: `"${data.n}"`,
      description,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: data.n }],
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

export default function SharedPatternPage({
  searchParams,
}: {
  searchParams: { d?: string };
}) {
  const d = searchParams.d;

  if (!d) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p
          className="font-sans text-xs tracking-[0.2em] uppercase"
          style={{ color: "var(--muted)" }}
        >
          No pattern found.
        </p>
      </div>
    );
  }

  const data = decode(d);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p
          className="font-sans text-xs tracking-[0.2em] uppercase"
          style={{ color: "var(--muted)" }}
        >
          Invalid pattern link.
        </p>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ animation: "fadeUp 0.6s ease-out forwards" }}
    >
      <div className="max-w-lg w-full">
        {/* Label */}
        <p
          className="font-sans text-xs tracking-[0.3em] uppercase mb-6"
          style={{ color: "var(--gold)" }}
        >
          Life Pattern · Seyrn
        </p>

        {/* Pattern name */}
        <h1
          className="font-serif font-light mb-4"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            lineHeight: 1.05,
            color: "var(--cream)",
          }}
        >
          {data.n}
        </h1>

        {/* Archetype */}
        <p
          className="font-sans font-light text-sm mb-10"
          style={{ color: "var(--muted)" }}
        >
          {data.a}
        </p>

        {/* Share sentences */}
        {data.s && data.s[0] && data.s[1] && (
          <div
            className="mb-10 space-y-5"
            style={{
              borderLeft: "2px solid rgba(201,168,76,0.28)",
              paddingLeft: "1.5rem",
            }}
          >
            <p
              className="font-serif font-light text-xl leading-snug"
              style={{ color: "var(--cream)", fontStyle: "italic" }}
            >
              &ldquo;{data.s[0]}&rdquo;
            </p>
            <p
              className="font-serif font-light text-xl leading-snug"
              style={{ color: "var(--warm)", fontStyle: "italic" }}
            >
              &ldquo;{data.s[1]}&rdquo;
            </p>
          </div>
        )}

        {/* Data points */}
        <div className="flex gap-8 mb-10 flex-wrap">
          {data.m && (
            <div>
              <p
                className="font-sans text-xs tracking-[0.15em] uppercase mb-1"
                style={{ color: "var(--muted)" }}
              >
                Energy Cycle
              </p>
              <p className="font-sans text-sm" style={{ color: "var(--cream)" }}>
                Every {data.m} months
              </p>
            </div>
          )}
          {data.y && (
            <div>
              <p
                className="font-sans text-xs tracking-[0.15em] uppercase mb-1"
                style={{ color: "var(--muted)" }}
              >
                Next Turning Point
              </p>
              <p className="font-sans text-sm" style={{ color: "var(--gold)" }}>
                ~{data.y}
              </p>
            </div>
          )}
          {data.sea && (
            <div>
              <p
                className="font-sans text-xs tracking-[0.15em] uppercase mb-1"
                style={{ color: "var(--muted)" }}
              >
                Current Season
              </p>
              <p className="font-sans text-sm" style={{ color: "var(--cream)" }}>
                {data.sea.charAt(0).toUpperCase() + data.sea.slice(1)}
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="divider-gold mb-10" />

        {/* CTA copy */}
        <p
          className="font-serif font-light text-2xl mb-2"
          style={{ color: "var(--cream)", lineHeight: 1.3 }}
        >
          Every life follows a pattern.
        </p>
        <p
          className="font-serif font-light text-2xl mb-10"
          style={{ color: "var(--muted)", lineHeight: 1.3 }}
        >
          Most people never see theirs.
        </p>

        <Link
          href="/onboarding"
          className="inline-block font-sans text-xs tracking-widest uppercase transition-all"
          style={{
            background: "var(--gold)",
            color: "var(--ink)",
            padding: "0.9rem 2.5rem",
            fontWeight: 500,
            letterSpacing: "0.14em",
          }}
        >
          Analyze your pattern →
        </Link>

        <p className="font-sans text-xs mt-4" style={{ color: "var(--muted)" }}>
          Free · Takes 8 minutes
        </p>
      </div>
    </main>
  );
}
