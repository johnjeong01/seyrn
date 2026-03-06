import type { Metadata } from "next";
import { Suspense } from "react";
import ReportClient from "./ReportClient";

export const metadata: Metadata = {
  title: "Your Life Pattern Report — Seyrn",
};

export default function ReportPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--ink)" }}>
      <Suspense>
        <ReportClient />
      </Suspense>
    </main>
  );
}
