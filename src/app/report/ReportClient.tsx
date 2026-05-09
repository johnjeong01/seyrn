"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { OnboardingData } from "@/lib/onboarding-types";
import type { ReportData } from "@/lib/report-types";
import LifeGraph from "./LifeGraph";
import ReportSections from "./ReportSections";
import UnlockBanner from "./UnlockBanner";

const REPORT_CACHE_KEY   = "seyrn-report-data-v2";
const ONBOARDING_KEY     = "seyrn-onboarding-data";
const PAID_KEY           = "seyrn-paid";
const PLAN_KEY           = "seyrn-plan";
const REPORT_ID_KEY      = "seyrn-report-id";
const MAGIC_SENT_KEY     = "seyrn-magic-sent";
const PENDING_VERIFY_KEY = "seyrn-pending-verify"; // reportId awaiting webhook confirmation

const LOADING_MESSAGES = [
  "Reading your turning points…",
  "Mapping your energy patterns…",
  "Identifying recurring themes…",
  "Calculating your next pivot…",
  "Building your forecast…",
  "Synthesizing your life pattern…",
  "Almost there…",
];

function LoadingState() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: "40vh" }}
    >
      <div
        className="mb-8"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.2)",
          borderTopColor: "var(--gold)",
          animation: "spin 1.2s linear infinite",
        }}
      />
      <p
        className="font-sans text-xs tracking-[0.2em] uppercase"
        style={{ color: "var(--muted)", animation: "fadeUp 0.4s ease-out forwards" }}
        key={msgIdx}
      >
        {LOADING_MESSAGES[msgIdx]}
      </p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ minHeight: "40vh" }}
    >
      <p
        className="font-sans text-xs tracking-[0.2em] uppercase mb-4"
        style={{ color: "var(--rust)" }}
      >
        Generation Failed
      </p>
      <p className="font-sans text-sm mb-8 max-w-sm" style={{ color: "var(--muted)" }}>
        {message}
      </p>
      <button
        onClick={onRetry}
        className="font-sans text-xs tracking-widest uppercase px-6 py-3 transition-colors"
        style={{ border: "1px solid var(--gold)", color: "var(--gold)", background: "transparent" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--ink)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gold)"; }}
      >
        Try Again
      </button>
    </div>
  );
}

export default function ReportClient() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [data,    setData]    = useState<OnboardingData | null>(null);
  const [report,  setReport]  = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // Payment state
  const [isPaid,     setIsPaid]     = useState(false);
  const [plan,       setPlan]       = useState<"one-time" | "monthly" | null>(null);
  const [reportId,   setReportId]   = useState<string | null>(null);
  const [verifying,  setVerifying]  = useState(false);

  // ── Load onboarding data + restore payment state ────────────────
  useEffect(() => {
    const saved = localStorage.getItem(ONBOARDING_KEY);
    if (!saved) { router.push("/onboarding"); return; }
    try {
      setData(JSON.parse(saved) as OnboardingData);
    } catch {
      router.push("/onboarding");
      return;
    }

    if (localStorage.getItem(PAID_KEY) === "true") {
      setIsPaid(true);
      const savedPlan = localStorage.getItem(PLAN_KEY);
      if (savedPlan === "one-time" || savedPlan === "monthly") setPlan(savedPlan);
    }
    const savedId = localStorage.getItem(REPORT_ID_KEY);
    if (savedId) setReportId(savedId);
  }, [router]);

  // ── On mount: retry pending verification (webhook may have fired since last visit) ──
  useEffect(() => {
    if (isPaid) return;
    const pendingId = localStorage.getItem(PENDING_VERIFY_KEY);
    if (!pendingId) return;

    fetch(`/api/verify-payment?reportId=${pendingId}`)
      .then((r) => r.json() as Promise<{ paid?: boolean; plan?: string }>)
      .then((body) => {
        if (body.paid) {
          const p = body.plan === "monthly" ? "monthly" : "one-time";
          localStorage.setItem(PAID_KEY,      "true");
          localStorage.setItem(PLAN_KEY,      p);
          localStorage.setItem(REPORT_ID_KEY, pendingId);
          localStorage.removeItem(PENDING_VERIFY_KEY);
          setReportId(pendingId);
          setPlan(p);
          setIsPaid(true);
        }
      })
      .catch(() => { /* silent — try again on next load */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Verify LemonSqueezy payment from redirect URL ───────────────
  // Poll DB instead of trusting ?paid=true from the URL directly.
  // LS webhook typically fires within 5–30 s after the redirect.
  useEffect(() => {
    const paramReportId = searchParams.get("reportId");
    const paid          = searchParams.get("paid");
    if (!paramReportId || paid !== "true" || isPaid) return;

    // Save pending ID immediately so page refresh can retry if we time out
    localStorage.setItem(PENDING_VERIFY_KEY, paramReportId);
    setVerifying(true);

    let cancelled = false;

    const confirm = (confirmedPlan: string) => {
      const p = confirmedPlan === "monthly" ? "monthly" : "one-time";
      localStorage.setItem(PAID_KEY,      "true");
      localStorage.setItem(PLAN_KEY,      p);
      localStorage.setItem(REPORT_ID_KEY, paramReportId);
      localStorage.removeItem(PENDING_VERIFY_KEY);
      setReportId(paramReportId);
      setPlan(p);
      setIsPaid(true);
      setVerifying(false);
      router.replace("/report");
    };

    const sig       = searchParams.get("sig");
    const sigParam  = sig ? `&sig=${encodeURIComponent(sig)}` : "";

    const verify = async () => {
      // Attempt 0 sends the HMAC sig → server confirms instantly without waiting
      // for the webhook. Attempts 1-9 fall back to DB polling (webhook may arrive
      // within seconds after the redirect).
      for (let attempt = 0; attempt < 10; attempt++) {
        if (cancelled) return;
        if (attempt > 0) await new Promise<void>((r) => setTimeout(r, 4000));
        const qs = attempt === 0 ? sigParam : "";
        try {
          const res  = await fetch(`/api/verify-payment?reportId=${paramReportId}${qs}`);
          const body = (await res.json()) as { paid?: boolean; plan?: string };
          if (body.paid) { confirm(body.plan ?? "one-time"); return; }
        } catch { /* retry */ }
      }
      // Timed out — PENDING_VERIFY_KEY stays so refresh can retry
      if (!cancelled) {
        setVerifying(false);
        router.replace("/report");
      }
    };

    verify();
    return () => { cancelled = true; setVerifying(false); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ── Send magic link once after payment confirmed ────────────────
  useEffect(() => {
    if (!isPaid) return;
    try {
      const raw   = localStorage.getItem(ONBOARDING_KEY);
      const email = raw ? (JSON.parse(raw) as { email?: string }).email ?? null : null;
      if (email && !localStorage.getItem(MAGIC_SENT_KEY)) {
        localStorage.setItem(MAGIC_SENT_KEY, "true");
        fetch("/api/auth/send-magic-link", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ email, redirectTo: `${window.location.origin}/report` }),
        }).catch(() => { /* silent */ });
      }
    } catch { /* ignore */ }
  }, [isPaid]);

  // ── Generate (or load cached) report ───────────────────────────
  const generateReport = useCallback(
    async (onboardingData: OnboardingData, forceRefresh = false) => {
      if (!forceRefresh) {
        const cached = localStorage.getItem(REPORT_CACHE_KEY);
        if (cached) {
          try {
            setReport(JSON.parse(cached) as ReportData);
            return;
          } catch { /* cache corrupted — fall through */ }
        }
      } else {
        localStorage.removeItem(REPORT_CACHE_KEY);
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/report", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ data: onboardingData }),
        });

        if (!res.ok) {
          let errorMsg = `Server error ${res.status}`;
          try {
            const errBody = (await res.json()) as { error?: string };
            if (errBody.error) errorMsg = errBody.error;
          } catch { /* non-JSON */ }
          throw new Error(errorMsg);
        }

        if (!res.body) throw new Error("No response body");
        const reader  = res.body.getReader();
        const decoder = new TextDecoder();
        let text = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
        }
        text += decoder.decode();

        const errIdx = text.indexOf("\x00ERR:");
        if (errIdx !== -1) throw new Error(text.slice(errIdx + 5).trim());

        const start = text.indexOf("{");
        const end   = text.lastIndexOf("}");
        if (start === -1 || end === -1) throw new Error("Invalid response format");

        const generatedReport = JSON.parse(text.slice(start, end + 1)) as ReportData;
        generatedReport.generated_at = new Date().toISOString();
        localStorage.setItem(REPORT_CACHE_KEY, JSON.stringify(generatedReport));
        setReport(generatedReport);

        // Ensure we always have a reportId for checkout — generate one client-side immediately
        const existingId = localStorage.getItem(REPORT_ID_KEY);
        const localId    = existingId ?? crypto.randomUUID();
        if (!existingId) {
          localStorage.setItem(REPORT_ID_KEY, localId);
          setReportId(localId);
        }

        // Try to pre-save report to DB; use the same localId so checkout/webhook can find it
        if (!existingId) {
          try {
            const raw       = localStorage.getItem(ONBOARDING_KEY);
            const parsed    = raw ? (JSON.parse(raw) as { email?: string; firstName?: string }) : {};
            await fetch("/api/reports/save", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({
                id:         localId,
                email:      parsed.email ?? null,
                firstName:  parsed.firstName ?? null,
                plan:       "one-time",
                reportData: generatedReport,
              }),
            });
          } catch { /* silent — checkout uses localId regardless */ }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (data) generateReport(data);
  }, [data, generateReport]);

  const handleRetry = useCallback(() => {
    if (data) generateReport(data, true);
  }, [data, generateReport]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-[var(--muted)] animate-pulse">
          Loading your pattern…
        </p>
      </div>
    );
  }

  const validTPs    = data.turningPoints.filter((tp) => tp.year !== null && tp.title.length > 0);
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 pb-32">
      {/* Payment verification banner */}
      {verifying && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 py-3"
          style={{ background: "rgba(201,168,76,0.12)", borderBottom: "1px solid rgba(201,168,76,0.25)" }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              border: "1.5px solid rgba(201,168,76,0.3)",
              borderTopColor: "var(--gold)",
              animation: "spin 1s linear infinite",
            }}
          />
          <p className="font-sans text-xs tracking-[0.18em] uppercase" style={{ color: "var(--gold)" }}>
            Confirming your payment…
          </p>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between mb-16">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase transition-colors"
          style={{ color: "var(--muted)" }}
        >
          <span>←</span> Retake
        </Link>
      </div>

      {/* Report header */}
      <div className="mb-16" style={{ animation: "fadeUp 0.6s ease-out forwards" }}>
        <p
          className="font-sans text-xs tracking-[0.2em] uppercase mb-5"
          style={{ color: "var(--gold)" }}
        >
          Life Pattern Report
        </p>
        <h1
          className="font-serif font-light mb-6"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1, color: "var(--cream)" }}
        >
          {validTPs.length} turning {validTPs.length === 1 ? "point" : "points"}.
          <br />
          One pattern.
        </h1>
        <p className="font-sans font-light text-sm" style={{ color: "var(--warm)" }}>
          Ages {data.currentAge} → {data.futureAge} · {currentYear}
        </p>
      </div>

      {/* Life Graph */}
      <div style={{ animation: "fadeUp 0.8s ease-out 0.2s both" }}>
        <LifeGraph data={data} />
      </div>

      {/* Analysis */}
      <div className="mt-24" style={{ animation: "fadeUp 0.8s ease-out 0.5s both" }}>
        <div className="divider-gold mb-16" />

        {loading && <LoadingState />}

        {error && !loading && <ErrorState message={error} onRetry={handleRetry} />}

        {report && !loading && (
          <ReportSections
            report={report}
            isPaid={isPaid}
            plan={plan}
            turningPoints={data.turningPoints}
            currentSeason={data.currentSeason}
            firstName={data.firstName}
          />
        )}
      </div>

      {/* Unlock banner — hidden once paid */}
      {report && !loading && (
        <UnlockBanner
          show={!isPaid}
          reportId={reportId}
        />
      )}
    </div>
  );
}
