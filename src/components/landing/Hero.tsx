"use client";

import Link from "next/link";

/* Animated background waveform — pure SVG, no dependencies */
function BackgroundWave() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle grid */}
        <defs>
          <pattern
            id="grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(255,255,255,0.025)"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#c9a84c" stopOpacity="0" />
            <stop offset="20%" stopColor="#c9a84c" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#c9a84c" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="fillGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1440" height="400" fill="url(#grid)" />

        {/* Area fill */}
        <path
          d="M 0 300 C 200 280 300 200 450 220 C 600 240 700 160 800 140 C 900 120 1000 180 1100 150 C 1200 120 1300 160 1440 140 L 1440 400 L 0 400 Z"
          fill="url(#fillGrad)"
        />

        {/* Main waveform line */}
        <path
          d="M 0 300 C 200 280 300 200 450 220 C 600 240 700 160 800 140 C 900 120 1000 180 1100 150 C 1200 120 1300 160 1440 140"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="1.5"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          style={{
            animation: "drawLine 3s ease-out 0.5s forwards",
          }}
        />

        {/* Glowing current position dot */}
        <circle
          cx="800"
          cy="140"
          r="4"
          fill="#c9a84c"
          className="pulse-gold"
          style={{ animation: "pulseGold 2.5s ease-in-out infinite" }}
        />
        <circle cx="800" cy="140" r="8" fill="rgba(201,168,76,0.15)" />
      </svg>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--deep)]">
      <BackgroundWave />

      {/* Radial glow from center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(201,168,76,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <p
          className="font-sans text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-8"
          style={{ opacity: 0, animation: "fadeIn 0.8s ease-out 0.2s forwards" }}
        >
          Life Pattern Analysis
        </p>

        {/* Headline — 3 clean lines, readable size */}
        <h1
          className="font-serif font-light text-[var(--cream)] mb-8"
          style={{
            fontSize: "clamp(2rem, 3.8vw, 3.2rem)",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            opacity: 0,
            animation: "fadeUp 1s ease-out 0.35s forwards",
          }}
        >
          You can&apos;t change yesterday.
          <br />
          But you can understand it.
          <br />
          And that changes everything about{" "}
          <em
            className="not-italic"
            style={{
              background: "linear-gradient(135deg, #e8c97a 0%, #c9a84c 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            today.
          </em>
        </h1>

        {/* Subheadline */}
        <p
          className="font-sans font-light text-[var(--warm)] mx-auto mb-12"
          style={{
            fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)",
            lineHeight: 1.8,
            opacity: 0,
            animation: "fadeUp 0.9s ease-out 0.55s forwards",
          }}
        >
          Seyrn analyzes the patterns in your past to help you make better choices today.
          <br />
          Not fortune-telling. Pattern recognition.
        </p>

        {/* CTA */}
        <div
          style={{
            opacity: 0,
            animation: "fadeUp 0.9s ease-out 0.75s forwards",
          }}
        >
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--gold)] text-[var(--ink)] font-sans font-medium text-sm tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all duration-500"
            style={{
              boxShadow: "0 0 40px rgba(201,168,76,0.25), 0 0 80px rgba(201,168,76,0.1)",
            }}
          >
            Discover Your Pattern
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 7H13M13 7L7 1M13 7L7 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Social proof */}
        <p
          className="mt-8 font-sans text-xs text-[var(--muted)] tracking-wide"
          style={{
            opacity: 0,
            animation: "fadeIn 0.8s ease-out 1.1s forwards",
          }}
        >
          Free to start · No account required · 15 minutes
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          opacity: 0,
          animation: "fadeIn 0.8s ease-out 1.4s forwards",
        }}
      >
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[var(--gold)]/40 to-transparent" />
      </div>
    </section>
  );
}
