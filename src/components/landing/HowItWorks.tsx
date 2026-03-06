"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Map your turning points",
    body: "Input the moments that changed everything. A job you left. A person who shifted your direction. A decision that still echoes. Each one becomes a data point.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="3" fill="#c9a84c" />
        <circle cx="6" cy="20" r="2.5" fill="#4a6355" />
        <circle cx="22" cy="8"  r="2.5" fill="#4a6355" />
        <circle cx="24" cy="20" r="2"   fill="#8b4a2f" />
        <line x1="6" y1="20" x2="14" y2="14" stroke="rgba(201,168,76,0.4)" strokeWidth="1" />
        <line x1="14" y1="14" x2="22"  y2="8"  stroke="rgba(201,168,76,0.4)" strokeWidth="1" />
        <line x1="14" y1="14" x2="24"  y2="20" stroke="rgba(201,168,76,0.2)" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "See your pattern",
    body: "AI reveals the cycles, rhythms, and blind spots in your life data. Not generic insights — specific observations drawn from your turning points.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 20 C6 18 8 10 11 11 C14 12 15 8 18 6 C21 4 23 10 26 8"
          stroke="#c9a84c" strokeWidth="1.5" fill="none" strokeLinecap="round"
        />
        <path
          d="M2 20 C6 18 8 10 11 11 C14 12 15 8 18 6 C21 4 23 10 26 8 L26 26 L2 26 Z"
          fill="rgba(201,168,76,0.06)"
        />
        <circle cx="18" cy="6" r="2.5" fill="#c9a84c" />
        <path
          d="M18 14 C20 18 24 20 26 22"
          stroke="rgba(201,168,76,0.3)" strokeWidth="1" strokeDasharray="2 2" fill="none"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Design what's next",
    body: "Know your next turning point before it arrives. Prepare instead of react. Every pattern has a next move — Seyrn shows you yours.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 22 C8 20 10 12 14 10 C18 8 20 14 24 12"
          stroke="#c9a84c" strokeWidth="1.5" fill="none" strokeLinecap="round"
        />
        <path
          d="M24 12 C25 10 26 8 27 6"
          stroke="rgba(201,168,76,0.4)" strokeWidth="1.5" strokeDasharray="2 2" fill="none" strokeLinecap="round"
        />
        <circle cx="24" cy="12" r="5" stroke="rgba(201,168,76,0.3)" strokeWidth="1" fill="none" strokeDasharray="3 2" />
        <circle cx="24" cy="12" r="2" fill="rgba(201,168,76,0.4)" />
        <text x="21" y="25" fontSize="6" fill="rgba(201,168,76,0.5)" fontFamily="sans-serif">next</text>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".step-card").forEach((el, i) => {
              (el as HTMLElement).style.animation = `fadeUp 0.8s ease-out ${i * 0.18}s forwards`;
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-section bg-[var(--ink)]"
      id="how-it-works"
    >
      {/* Subtle top border */}
      <div className="divider-gold w-full absolute top-0" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="max-w-xl mb-20">
          <p className="font-sans text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-4">
            How It Works
          </p>
          <h2 className="font-serif font-light text-[var(--cream)]" style={{ fontSize: "clamp(2rem,4vw,3.25rem)" }}>
            Three steps from confusion
            <br />
            to <em className="italic">clarity.</em>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-px bg-[var(--gold)]/8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="step-card opacity-0 bg-[var(--ink)] p-10 md:p-12 flex flex-col gap-6 group hover:bg-[#141210] transition-colors duration-500"
            >
              {/* Number */}
              <span
                className="font-serif text-[var(--gold)]/20 font-light"
                style={{ fontSize: "4.5rem", lineHeight: 1 }}
              >
                {step.number}
              </span>

              {/* Icon */}
              <div className="mb-2">{step.icon}</div>

              {/* Title */}
              <h3
                className="font-serif font-light text-[var(--cream)]"
                style={{ fontSize: "clamp(1.3rem,2.2vw,1.7rem)" }}
              >
                {step.title}
              </h3>

              {/* Body */}
              <p className="font-sans font-light text-[var(--muted)] text-sm leading-relaxed">
                {step.body}
              </p>

              {/* Bottom accent */}
              <div className="mt-auto pt-6">
                <div
                  className="h-px bg-[var(--gold)]/20 transition-all duration-700 group-hover:bg-[var(--gold)]/50"
                  style={{ width: "2rem" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Timeline connector */}
        <div className="hidden md:flex items-center justify-between px-12 mt-8 relative">
          <div className="absolute left-12 right-12 top-1/2 -translate-y-1/2 h-px bg-[var(--gold)]/10" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-[var(--gold)]/30 relative z-10" />
          ))}
        </div>
      </div>
    </section>
  );
}
