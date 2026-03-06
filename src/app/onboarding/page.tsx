import type { Metadata } from "next";
import OnboardingClient from "./OnboardingClient";

export const metadata: Metadata = {
  title: "Map Your Life Pattern — Seyrn",
};

export default function OnboardingPage() {
  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--ink)" }}
    >
      <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
        <OnboardingClient />
      </div>
    </main>
  );
}
