"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "py-4 bg-[var(--ink)]/90 backdrop-blur-xl border-b border-[var(--gold)]/10"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-serif text-xl tracking-[0.2em] text-[var(--cream)] uppercase"
          style={{ letterSpacing: "0.25em" }}
        >
          Seyrn
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-6">
          <Link
            href="#how-it-works"
            className="hidden md:block text-sm text-[var(--muted)] hover:text-[var(--cream)] transition-colors duration-300 font-sans font-light tracking-wide"
          >
            How it Works
          </Link>
          <Link
            href="#report"
            className="hidden md:block text-sm text-[var(--muted)] hover:text-[var(--cream)] transition-colors duration-300 font-sans font-light tracking-wide"
          >
            Sample
          </Link>
          <Link
            href="#pricing"
            className="hidden sm:block text-sm text-[var(--muted)] hover:text-[var(--cream)] transition-colors duration-300 font-sans font-light tracking-wide"
          >
            Pricing
          </Link>
          <Link
            href="/onboarding"
            className="text-sm font-sans font-medium px-5 py-2.5 bg-[var(--gold)] text-[var(--ink)] hover:bg-[var(--gold-light)] transition-all duration-400 tracking-wide"
          >
            Start Free →
          </Link>
        </div>
      </div>
    </nav>
  );
}
