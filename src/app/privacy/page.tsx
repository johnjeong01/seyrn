import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Seyrn",
  description: "How Seyrn collects, uses, and protects your personal data.",
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

function UL({ items }: { items: string[] }) {
  return (
    <ul className="mb-4 flex flex-col gap-2 pl-4">
      {items.map((item, i) => (
        <li key={i} style={{ listStyleType: "disc", listStylePosition: "inside", color: "var(--warm)" }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
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
            Privacy Policy
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
              Seyrn is built on the premise that your personal history is meaningful. We take the
              responsibility of handling that history seriously. This policy explains exactly what
              we collect, why, and what you can do about it.
            </p>
          </div>
        </div>

        <div
          style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "3rem" }}
        />

        <Section title="1. Who We Are">
          <P>
            Seyrn (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the website seyrn.app and
            provides an AI-powered life pattern analysis service. For questions about this policy,
            contact us at{" "}
            <a
              href="mailto:hello@seyrn.app"
              style={{ color: "var(--gold)", textDecoration: "underline" }}
            >
              hello@seyrn.app
            </a>
            .
          </P>
        </Section>

        <Section title="2. Information We Collect">
          <P>
            We collect information you directly provide when using Seyrn. This falls into three
            categories:
          </P>
          <P>
            <span style={{ color: "var(--cream)", fontWeight: 500 }}>Identity &amp; Contact</span>
          </P>
          <UL items={["First name", "Email address"]} />
          <P>
            <span style={{ color: "var(--cream)", fontWeight: 500 }}>
              Life History &amp; Pattern Data
            </span>
          </P>
          <UL
            items={[
              "Current age and target future age",
              "Life season (your self-assessed current phase)",
              "Turning points: year, title, category, energy level at the time, people involved, emotions experienced, outcome, and duration",
              "Open-text responses about recurring patterns, peak moments, fears, regrets, and goals",
              "Behavioral preferences: how you respond to change, when your energy peaks, how you recognize burnout",
            ]}
          />
          <P>
            <span style={{ color: "var(--cream)", fontWeight: 500 }}>
              Technical &amp; Usage Data
            </span>
          </P>
          <UL
            items={[
              "IP address (used for fraud prevention and rate limiting)",
              "Browser type and device information",
              "Pages visited and time on site (via Vercel analytics, if enabled)",
              "Data stored in your browser's localStorage during onboarding (cleared when you clear browser data)",
            ]}
          />
        </Section>

        <Section title="3. How We Use Your Information">
          <P>We use your information for the following purposes:</P>
          <UL
            items={[
              "To generate your personalized life pattern analysis report",
              "To send your report link to your email address",
              "To store your report so you can access it again",
              "To send transactional emails (report delivery, waitlist confirmation)",
              "To process your payment and issue receipts",
              "To improve the service based on aggregate, anonymized usage patterns",
              "To respond to support inquiries and data requests",
            ]}
          />
          <P>We do not sell your data. We do not use your data for advertising.</P>
        </Section>

        <Section title="4. AI Processing">
          <P>
            Seyrn uses Claude, an AI model developed by Anthropic, to analyze your turning points
            and generate your pattern report. When you submit your onboarding data, it is sent
            to Anthropic&apos;s API servers for processing.
          </P>
          <P>
            <span style={{ color: "var(--cream)", fontWeight: 500 }}>
              What this means in practice:
            </span>
          </P>
          <UL
            items={[
              "Your data (name, turning points, emotional responses) is transmitted to Anthropic servers to generate your report",
              "Anthropic's data use is governed by their privacy policy and API usage terms",
              "We do not store your data on Anthropic's systems — only the generated report output is retained in our database",
              "Your data is not used to train AI models",
            ]}
          />
        </Section>

        <Section title="5. Data Storage & Security">
          <P>
            Your data is stored in Supabase, a managed PostgreSQL database hosted on Amazon Web
            Services (AWS) infrastructure in the United States. All data is encrypted at rest
            and in transit (TLS 1.2+).
          </P>
          <P>
            During onboarding, your in-progress responses are temporarily stored in your
            browser&apos;s localStorage. This data never leaves your device until you complete
            onboarding and submit. Clearing your browser data removes this temporary storage.
          </P>
          <P>
            Access to our database is protected by Row-Level Security (RLS) policies. Your report
            and any personal data can only be accessed by you (via your verified email) or by
            Seyrn staff for authorized support purposes.
          </P>
        </Section>

        <Section title="6. Third-Party Services">
          <P>
            Seyrn uses the following third-party services, each of which has its own privacy
            policy:
          </P>
          <UL
            items={[
              "Anthropic — AI report generation (anthropic.com/privacy)",
              "Supabase — Database and authentication (supabase.com/privacy)",
              "Lemon Squeezy — Payment processing (lemonsqueezy.com/privacy)",
              "Resend — Transactional email delivery (resend.com/privacy)",
              "Vercel — Website hosting and edge delivery (vercel.com/legal/privacy-policy)",
            ]}
          />
          <P>
            We share only the minimum data required for each service to function. Payment
            processing is handled entirely by Lemon Squeezy — we never store your credit card
            details.
          </P>
        </Section>

        <Section title="7. Data Retention">
          <P>
            We retain your data for as long as your account or report is active, or as needed
            to provide the service.
          </P>
          <UL
            items={[
              "One-time report purchasers: your report and associated data are retained indefinitely until you request deletion",
              "Waitlist subscribers: your email is retained until you unsubscribe or request deletion",
              "Incomplete onboarding sessions: localStorage data is cleared when you clear your browser — we do not retain partial submissions on our servers",
            ]}
          />
        </Section>

        <Section title="8. Your Rights">
          <P>
            Depending on where you live, you may have the following rights regarding your
            personal data:
          </P>
          <UL
            items={[
              "Access: Request a copy of all personal data we hold about you",
              "Correction: Request that inaccurate data be corrected",
              "Deletion: Request permanent deletion of all your data ('right to be forgotten')",
              "Portability: Request your data in a structured, machine-readable format",
              "Restriction: Request that we stop processing your data while a dispute is resolved",
              "Objection: Object to processing based on legitimate interests",
            ]}
          />
          <P>
            To exercise any of these rights, email{" "}
            <a
              href="mailto:hello@seyrn.app"
              style={{ color: "var(--gold)", textDecoration: "underline" }}
            >
              hello@seyrn.app
            </a>{" "}
            with the subject line &quot;Data Request&quot; and the email address associated with
            your report. We will respond within 30 days.
          </P>
          <P>
            For deletion requests: we will permanently delete your report, all associated
            personal data, and your email from our systems. This cannot be undone.
          </P>
        </Section>

        <Section title="9. Cookies & Local Storage">
          <P>
            Seyrn does not use tracking cookies or advertising cookies. We use browser
            localStorage to temporarily store your onboarding progress. This is not a cookie
            and is not transmitted to any server until you submit your completed onboarding.
          </P>
          <P>
            If we introduce analytics in the future, we will update this policy and provide
            opt-out options.
          </P>
        </Section>

        <Section title="10. Children's Privacy">
          <P>
            Seyrn is not intended for use by anyone under the age of 18. We do not knowingly
            collect personal data from children. If you believe a minor has submitted data
            through our service, please contact us immediately at{" "}
            <a
              href="mailto:hello@seyrn.app"
              style={{ color: "var(--gold)", textDecoration: "underline" }}
            >
              hello@seyrn.app
            </a>{" "}
            and we will delete it promptly.
          </P>
        </Section>

        <Section title="11. International Data Transfers">
          <P>
            Seyrn is operated from South Korea. Our infrastructure (Supabase/AWS, Vercel,
            Anthropic) is primarily based in the United States. By using Seyrn, you acknowledge
            that your data may be transferred to and processed in countries outside your country
            of residence, including the United States, where data protection laws may differ.
          </P>
          <P>
            We take reasonable steps to ensure your data is protected in accordance with this
            privacy policy regardless of where it is processed.
          </P>
        </Section>

        <Section title="12. Changes to This Policy">
          <P>
            We may update this policy from time to time. When we make material changes, we will
            update the &quot;Last updated&quot; date at the top of this page and, where
            appropriate, notify you by email. Continued use of Seyrn after changes take effect
            constitutes your acceptance of the revised policy.
          </P>
        </Section>

        <Section title="13. Contact">
          <P>
            For any questions, concerns, or data requests related to this privacy policy, contact
            us at:
          </P>
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
          className="mt-16 pt-8 flex items-center justify-between flex-wrap gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Link href="/terms" className="font-sans text-xs" style={{ color: "var(--muted)" }}>
            Terms of Service →
          </Link>
          <Link href="/refund" className="font-sans text-xs" style={{ color: "var(--muted)" }}>
            Refund Policy →
          </Link>
          <Link href="/" className="font-sans text-xs" style={{ color: "var(--muted)" }}>
            Back to Seyrn →
          </Link>
        </div>
      </main>
    </div>
  );
}
