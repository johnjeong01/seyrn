"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import WaitlistModal from "./WaitlistModal";

const oneTimePlan = {
  id: "one-time",
  badge: null as string | null,
  label: "One-Time",
  price: "$19",
  period: "once",
  description: "Everything you need to understand your pattern right now.",
  features: [
    "Full 6-section pattern analysis",
    "Complete life graph (past + predicted future)",
    "Next turning point timing + preparation plan",
    "Share card for social",
    "Permanent access to your report",
  ],
  cta: "Get Full Report",
  href: "/onboarding?plan=one-time",
  highlight: false,
  isWaitlist: false,
};

const waitlistPlan = {
  id: "monthly",
  badge: "COMING SOON" as string | null,
  label: "Monthly",
  price: "$9.99",
  period: "per month",
  description: "The longer you use Seyrn, the sharper your choices become.",
  features: [
    "Everything in One-Time",
    "Quarterly pattern updates",
    "Pattern accuracy deepens over time",
    "Daily email report — one insight, every morning, from your data",
    "Personalized daily strategy",
    "Real-time graph updates",
  ],
  cta: "Join the Waitlist →",
  href: "#",
  highlight: true,
  isWaitlist: true,
};

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
      <path d="M2 7.5L5.5 11L12 3" stroke="#4a6355" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


export default function Pricing() {
  const [visible, setVisible] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="pricing"
      className="relative py-section bg-[var(--deep)]"
    >
      <div className="divider-gold w-full absolute top-0" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-4">
            Pricing
          </p>
          <h2
            className="font-serif font-light text-[var(--cream)] mb-5"
            style={{ fontSize: "clamp(2rem,4vw,3.25rem)" }}
          >
            Less than one therapy session.
          </h2>
          <p className="font-sans font-light text-[var(--warm)] max-w-md mx-auto text-sm leading-relaxed">
            More self-knowledge than a decade of journaling.
          </p>
        </div>

        {/* Plan cards */}
        <div
          className="grid md:grid-cols-2 gap-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          {/* One-time plan */}
          <div
            className="relative flex flex-col p-8 md:p-10"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-[var(--muted)] mb-5">
              {oneTimePlan.label}
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <span
                className="font-serif font-light text-[var(--cream)]"
                style={{ fontSize: "clamp(2.5rem,5vw,3.5rem)", lineHeight: 1 }}
              >
                {oneTimePlan.price}
              </span>
              <span className="font-sans text-sm text-[var(--muted)]">{oneTimePlan.period}</span>
            </div>
            <p className="font-sans font-light text-[var(--warm)] text-sm mb-8 leading-relaxed">
              {oneTimePlan.description}
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              {oneTimePlan.features.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5 font-sans text-sm text-[var(--warm)]">
                  <Check />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <Link
                href={oneTimePlan.href}
                className="block w-full text-center py-3.5 font-sans font-medium text-sm tracking-widest uppercase transition-all duration-400 border border-[var(--cream)]/20 text-[var(--cream)] hover:border-[var(--cream)]/50"
              >
                {oneTimePlan.cta}
              </Link>
            </div>
          </div>

          {/* Waitlist (monthly) plan */}
          <div
            className="relative flex flex-col p-8 md:p-10"
            style={{
              background: "rgba(201,168,76,0.04)",
              border: "1px solid rgba(201,168,76,0.25)",
            }}
          >
            {/* COMING SOON badge */}
            <div className="absolute -top-3 left-8">
              <span className="font-sans text-[10px] tracking-widest uppercase px-3 py-1 bg-[var(--gold)] text-[var(--ink)] font-medium">
                Coming Soon
              </span>
            </div>

            <p className="font-sans text-xs tracking-[0.25em] uppercase text-[var(--muted)] mb-5">
              {waitlistPlan.label}
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <span
                className="font-serif font-light text-[var(--cream)]"
                style={{ fontSize: "clamp(2.5rem,5vw,3.5rem)", lineHeight: 1 }}
              >
                {waitlistPlan.price}
              </span>
              <span className="font-sans text-sm text-[var(--muted)]">{waitlistPlan.period}</span>
            </div>
            <p className="font-sans font-light text-[var(--warm)] text-sm mb-8 leading-relaxed">
              {waitlistPlan.description}
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              {waitlistPlan.features.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5 font-sans text-sm text-[var(--warm)]">
                  <Check />
                  <span className="flex items-center gap-2 flex-wrap">
                    {f}
                    {i === 3 && (
                      <span className="font-sans text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
                        Coming Soon
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <button
                onClick={() => setWaitlistOpen(true)}
                className="block w-full text-center py-3.5 font-sans font-medium text-sm tracking-widest uppercase transition-all duration-400 bg-[var(--gold)] text-[var(--ink)] hover:bg-[var(--gold-light)]"
                style={{ boxShadow: "0 0 30px rgba(201,168,76,0.15)" }}
              >
                {waitlistPlan.cta}
              </button>
            </div>
          </div>
        </div>

        {/* Nudge below cards */}
        <p className="text-center font-sans text-xs text-[var(--muted)] mt-6">
          Not sure? Start with the one-time report.
        </p>

        {/* Trust line */}
        <p className="text-center font-sans text-xs text-[var(--muted)]/50 mt-4 tracking-wide">
          One-time payment · Instant access · No subscriptions unless you want them
        </p>
      </div>

      {/* Waitlist modal */}
      {waitlistOpen && (
        <WaitlistModal onClose={() => setWaitlistOpen(false)} />
      )}
    </section>
  );
}
