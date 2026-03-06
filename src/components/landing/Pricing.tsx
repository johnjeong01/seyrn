"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const plans = [
  {
    id: "one-time",
    badge: null,
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
    coming: [],
    cta: "Get Full Report",
    href: "/onboarding?plan=one-time",
    highlight: false,
  },
  {
    id: "monthly",
    badge: "Most valuable",
    label: "Monthly",
    price: "$9.99",
    period: "per month",
    description: "Your pattern sharpens every week. Designed for sustained growth.",
    features: [
      "Everything in One-Time",
      "Quarterly report updates",
      "Pattern accuracy improves over time",
      "Weekly Check-In (coming soon)",
    ],
    coming: [
      "Daily Pattern Journal",
      "Personalized daily strategy",
      "Real-time graph updates",
    ],
    cta: "Start Monthly",
    href: "/onboarding?plan=monthly",
    highlight: true,
  },
];

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
      <path d="M2 7.5L5.5 11L12 3" stroke="#4a6355" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ComingSoonTag() {
  return (
    <span className="ml-2 font-sans text-[9px] tracking-widest uppercase px-1.5 py-0.5 border border-[var(--gold)]/30 text-[var(--gold)]/60">
      Soon
    </span>
  );
}

export default function Pricing() {
  const [visible, setVisible] = useState(false);
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
          <p className="font-sans font-light text-[var(--muted)] max-w-md mx-auto text-sm leading-relaxed">
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
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="relative flex flex-col p-8 md:p-10"
              style={{
                background: plan.highlight
                  ? "rgba(201,168,76,0.04)"
                  : "rgba(255,255,255,0.02)",
                border: plan.highlight
                  ? "1px solid rgba(201,168,76,0.25)"
                  : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-8">
                  <span className="font-sans text-[10px] tracking-widest uppercase px-3 py-1 bg-[var(--gold)] text-[var(--ink)] font-medium">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Label */}
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-[var(--muted)] mb-5">
                {plan.label}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-2">
                <span
                  className="font-serif font-light text-[var(--cream)]"
                  style={{ fontSize: "clamp(2.5rem,5vw,3.5rem)", lineHeight: 1 }}
                >
                  {plan.price}
                </span>
                <span className="font-sans text-sm text-[var(--muted)]">{plan.period}</span>
              </div>
              <p className="font-sans font-light text-[var(--muted)] text-sm mb-8 leading-relaxed">
                {plan.description}
              </p>

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 font-sans text-sm text-[var(--warm)]">
                    <Check />
                    <span>{f}</span>
                  </li>
                ))}
                {plan.coming.map((f, i) => (
                  <li key={`soon-${i}`} className="flex items-start gap-2.5 font-sans text-sm text-[var(--muted)]/60">
                    <Check />
                    <span>
                      {f}
                      <ComingSoonTag />
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-auto">
                <Link
                  href={plan.href}
                  className={`block w-full text-center py-3.5 font-sans font-medium text-sm tracking-widest uppercase transition-all duration-400 ${
                    plan.highlight
                      ? "bg-[var(--gold)] text-[var(--ink)] hover:bg-[var(--gold-light)]"
                      : "border border-[var(--cream)]/20 text-[var(--cream)] hover:border-[var(--cream)]/50 hover:bg-[var(--cream)]/4"
                  }`}
                  style={
                    plan.highlight
                      ? { boxShadow: "0 0 30px rgba(201,168,76,0.15)" }
                      : {}
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Coming soon notice */}
        <div
          className="mt-10 p-6 text-center"
          style={{ border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="font-sans text-xs tracking-widest uppercase text-[var(--gold)]/50 mb-2">
            Coming Soon
          </p>
          <p className="font-serif font-light text-[var(--cream)]/60 text-lg mb-1">
            Daily Pattern Journal
          </p>
          <p className="font-sans text-sm text-[var(--muted)] max-w-md mx-auto">
            Every day you record makes your strategy sharper. No two strategies are alike — because no two lives are.
          </p>
        </div>

        {/* Trust line */}
        <p className="text-center font-sans text-xs text-[var(--muted)]/50 mt-8 tracking-wide">
          One-time payment · Instant access · No subscriptions unless you want them
        </p>
      </div>
    </section>
  );
}
