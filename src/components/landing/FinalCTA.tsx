"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function FinalCTA() {
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
    <section
      ref={ref}
      className="relative py-section overflow-hidden bg-[var(--ink)]"
    >
      <div className="divider-gold w-full absolute top-0" />

      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Subtle waveform echo */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-20"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 0 120 C 200 110 300 60 450 80 C 600 100 700 40 900 50 C 1100 60 1300 80 1440 60"
          fill="none"
          stroke="rgba(201,168,76,0.4)"
          strokeWidth="1"
        />
      </svg>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Pull quote */}
        <div
          className="mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
          }}
        >
          <span
            className="font-serif italic text-[var(--gold)]/40"
            style={{ fontSize: "4rem", lineHeight: 1 }}
          >
            &ldquo;
          </span>
          <p
            className="font-serif font-light text-[var(--cream)] -mt-6"
            style={{ fontSize: "clamp(1.3rem,3vw,2rem)", lineHeight: 1.4 }}
          >
            The pattern has been running your life —
            <br />
            silently, consistently — for years.
            <br />
            When you see it clearly, you stop reacting.
            <br />
            You start <em className="italic">choosing.</em>
          </p>
        </div>

        {/* Main headline */}
        <h2
          className="font-serif font-light text-[var(--cream)] mb-6"
          style={{
            fontSize: "clamp(2rem,4.5vw,3.5rem)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.9s ease-out 0.15s, transform 0.9s ease-out 0.15s",
          }}
        >
          Clarity about your past
          <br />
          changes everything about today.
        </h2>

        <p
          className="font-sans font-light text-[var(--muted)] mb-12 text-base"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.9s ease-out 0.28s, transform 0.9s ease-out 0.28s",
          }}
        >
          That shift is available right now.
        </p>

        {/* CTA button */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.9s ease-out 0.42s, transform 0.9s ease-out 0.42s",
          }}
        >
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-3 px-12 py-5 bg-[var(--gold)] text-[var(--ink)] font-sans font-medium text-sm tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all duration-500"
            style={{
              boxShadow: "0 0 50px rgba(201,168,76,0.2), 0 0 100px rgba(201,168,76,0.08)",
            }}
          >
            Start Your Pattern Analysis
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <p
          className="mt-6 font-sans text-xs text-[var(--muted)]/50"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.9s ease-out 0.6s",
          }}
        >
          Free to start · 10 minutes · No account required
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-24 pt-8 border-t border-[rgba(255,255,255,0.05)]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg tracking-[0.25em] text-[var(--cream)]/40 uppercase">
            Seyrn
          </span>
          <p className="font-sans text-xs text-[var(--muted)]/40">
            © 2026 Seyrn · All rights reserved
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="font-sans text-xs text-[var(--muted)]/40 hover:text-[var(--muted)] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="font-sans text-xs text-[var(--muted)]/40 hover:text-[var(--muted)] transition-colors">
              Terms
            </Link>
            <Link href="/refund" className="font-sans text-xs text-[var(--muted)]/40 hover:text-[var(--muted)] transition-colors">
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
