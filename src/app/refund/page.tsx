import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — Seyrn",
  description: "Seyrn's refund policy for one-time report purchases and monthly subscriptions.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <p
        className="font-sans uppercase mb-3"
        style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "var(--gold)" }}
      >
        {title}
      </p>
      <div
        className="font-sans font-light text-sm leading-relaxed"
        style={{ color: "var(--warm)" }}
      >
        {children}
      </div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4">{children}</p>;
}

export default function RefundPage() {
  return (
    <div style={{ background: "var(--ink)", minHeight: "100vh" }}>
      {/* Header */}
      <header
        className="border-b"
        style={{ borderColor: "rgba(201,168,76,0.12)", padding: "1.25rem 1.5rem" }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-lg tracking-[0.25em] uppercase"
            style={{ color: "var(--cream)" }}
          >
            Seyrn
          </Link>
          <Link
            href="/"
            className="font-sans text-xs tracking-wide"
            style={{ color: "var(--muted)" }}
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="mb-14">
          <p
            className="font-sans uppercase mb-4"
            style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--gold)" }}
          >
            Legal
          </p>
          <h1
            className="font-serif font-light mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", color: "var(--cream)", lineHeight: 1.2 }}
          >
            Refund Policy
          </h1>
          <p className="font-sans text-sm" style={{ color: "var(--muted)" }}>
            Last updated: May 2026
          </p>
          <div
            className="mt-8 p-5"
            style={{
              background: "rgba(201,168,76,0.04)",
              border: "1px solid rgba(201,168,76,0.15)",
              borderLeft: "3px solid var(--gold)",
            }}
          >
            <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--warm)" }}>
              We want you to feel confident purchasing Seyrn. If something isn&apos;t right,
              reach out — we&apos;ll do our best to make it right.
            </p>
          </div>
        </div>

        <div
          style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "3rem" }}
        />

        <Section title="1. One-Time Report — $19">
          <P>
            <span style={{ color: "var(--cream)", fontWeight: 500 }}>
              Full refund within 7 days of purchase
            </span>
            {" "}— if your report has not yet been generated or delivered to your email,
            you are entitled to a full refund with no questions asked.
          </P>
          <P>
            <span style={{ color: "var(--cream)", fontWeight: 500 }}>
              No refund after report delivery
            </span>
            {" "}— once your personalized report has been generated and the access link
            delivered to your email, the purchase is considered fulfilled and is non-refundable.
            This is because the AI analysis is custom-generated for your specific turning points
            and cannot be reversed or reassigned.
          </P>
          <P>
            If you experienced a technical issue that prevented you from accessing your report
            (e.g., email not received, page error during generation), please contact us within
            14 days — we will resolve it or issue a refund at our discretion.
          </P>
        </Section>

        <Section title="2. Monthly Subscription (Coming Soon)">
          <P>
            <span style={{ color: "var(--cream)", fontWeight: 500 }}>Cancellation</span>
            {" "}— you may cancel your subscription at any time. Cancellation takes effect at
            the end of the current billing period. You retain full access until then.
          </P>
          <P>
            <span style={{ color: "var(--cream)", fontWeight: 500 }}>No partial refunds</span>
            {" "}— we do not issue prorated refunds for unused days within a billing period.
          </P>
          <P>
            <span style={{ color: "var(--cream)", fontWeight: 500 }}>First charge refund</span>
            {" "}— if you are charged for a renewal you intended to cancel, contact us within
            3 days and we will refund the charge.
          </P>
        </Section>

        <Section title="3. How to Request a Refund">
          <P>
            Email us at{" "}
            <a
              href="mailto:hello@seyrn.app"
              style={{ color: "var(--gold)", textDecoration: "underline" }}
            >
              hello@seyrn.app
            </a>{" "}
            with the subject line <span style={{ color: "var(--cream)" }}>&quot;Refund Request&quot;</span> and
            include:
          </P>
          <ul className="mb-4 flex flex-col gap-2 pl-4">
            {[
              "The email address used at purchase",
              "Your order number (found in your Paddle receipt email)",
              "A brief description of the issue (if applicable)",
            ].map((item, i) => (
              <li key={i} style={{ listStyleType: "disc", listStylePosition: "inside", color: "var(--warm)" }}>
                {item}
              </li>
            ))}
          </ul>
          <P>
            We respond to all refund requests within 3 business days. Approved refunds are
            processed through Paddle and typically appear in your account within 5–10
            business days depending on your bank.
          </P>
        </Section>

        <Section title="4. Chargebacks">
          <P>
            If you file a chargeback with your bank or card issuer before contacting us, we
            reserve the right to dispute the chargeback and provide evidence of service delivery.
            We encourage you to reach out to us first — most issues can be resolved quickly
            without involving your bank.
          </P>
        </Section>

        <Section title="5. Contact">
          <P>For refund requests or billing questions:</P>
          <div
            className="p-5 mt-2"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="font-sans text-sm" style={{ color: "var(--cream)" }}>
              Seyrn
              <br />
              <a
                href="mailto:hello@seyrn.app"
                style={{ color: "var(--gold)", textDecoration: "underline" }}
              >
                hello@seyrn.app
              </a>
            </p>
          </div>
        </Section>

        {/* Footer nav */}
        <div
          className="mt-16 pt-8 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Link href="/terms" className="font-sans text-xs" style={{ color: "var(--muted)" }}>
            ← Terms of Service
          </Link>
          <Link href="/privacy" className="font-sans text-xs" style={{ color: "var(--muted)" }}>
            Privacy Policy →
          </Link>
        </div>
      </main>
    </div>
  );
}
