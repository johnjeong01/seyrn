"use client";

import { useEffect, useRef, useState } from "react";

export default function Philosophy() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-section bg-[var(--deep)]">
      <div className="divider-gold w-full absolute top-0" />

      <div className="max-w-4xl mx-auto px-6">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 1s ease-out, transform 1s ease-out",
          }}
        >
          {/* Eyebrow */}
          <p className="font-sans text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-8">
            The Philosophy
          </p>

          {/* Title */}
          <h2
            className="font-serif font-light text-[var(--cream)] mb-12"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", lineHeight: 1.1 }}
          >
            This is not about the future.
          </h2>

          {/* Body — two columns on desktop */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p
                className="font-sans font-light text-sm leading-relaxed mb-5"
                style={{ color: "var(--warm)" }}
              >
                Most self-improvement tools ask you to imagine a better future.
              </p>
              <p
                className="font-sans font-light text-sm leading-relaxed mb-5"
                style={{ color: "var(--warm)" }}
              >
                Seyrn asks something harder: to understand your actual past.
              </p>
              <p
                className="font-sans font-light text-sm leading-relaxed"
                style={{ color: "var(--warm)" }}
              >
                Because the pattern that&apos;s been running your life — silently,
                consistently — is already there. In your data.
              </p>
            </div>

            <div>
              <p
                className="font-sans font-light text-sm leading-relaxed mb-5"
                style={{ color: "var(--warm)" }}
              >
                When you see it clearly, you stop reacting to your life and
                start responding to it.
              </p>
              <p
                className="font-sans font-light text-sm leading-relaxed mb-8"
                style={{ color: "var(--warm)" }}
              >
                That shift happens today. Not someday.
              </p>

              {/* Pull quote */}
              <div
                style={{
                  borderLeft: "2px solid var(--gold)",
                  paddingLeft: "1.25rem",
                }}
              >
                <p
                  className="font-serif font-light"
                  style={{
                    fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)",
                    color: "var(--cream)",
                    lineHeight: 1.45,
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;Every day you understand yourself more clearly, your
                  choices become more precise.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
