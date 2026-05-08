import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { ReportData } from "@/lib/report-types";
import SharedReportView from "./SharedReportView";

async function fetchReport(token: string) {
  return getSupabaseAdmin()
    .from("reports")
    .select("report_data")
    .eq("share_token", token)
    .eq("is_paid", true)
    .maybeSingle();
}

export async function generateMetadata({
  params,
}: {
  params: { token: string };
}): Promise<Metadata> {
  const { data } = await fetchReport(params.token);
  const r = data?.report_data as ReportData | null;
  if (!r) return { title: "Seyrn — Life Pattern Analysis" };

  return {
    title: `"${r.pattern_name}" — Seyrn`,
    description: r.pattern_archetype,
    openGraph: {
      title: `"${r.pattern_name}"`,
      description: r.pattern_archetype,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `"${r.pattern_name}"`,
      description: r.pattern_archetype,
    },
  };
}

export default async function SharedReportPage({
  params,
}: {
  params: { token: string };
}) {
  const { data, error } = await fetchReport(params.token);
  if (error || !data?.report_data) notFound();

  return (
    <main className="min-h-screen" style={{ background: "var(--ink)" }}>
      <SharedReportView report={data.report_data as ReportData} />
    </main>
  );
}
