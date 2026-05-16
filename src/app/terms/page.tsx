import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Seyrn",
  description: "Terms governing your use of Seyrn and our life pattern analysis service.",
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

export default function TermsPage() {
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
            Terms of Service
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
              By using Seyrn, you agree to these terms. Please read them carefully. If you do not
              agree, do not use the service.
            </p>
          </div>
        </div>

        <div
          style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "3rem" }}
        />

        <Section title="1. About Seyrn">
          <P>
            Seyrn (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the website seyrn.app
            and provides an AI-powered life pattern analysis service. These Terms of Service
            (&quot;Terms&quot;) govern your access to and use of Seyrn.
          </P>
          <P>
            By accessing or using Seyrn — including completing onboarding, purchasing a report,
            or joining the waitlist — you agree to be bound by these Terms.
          </P>
        </Section>

        <Section title="2. Eligibility">
          <P>
            You must be at least 18 years old to use Seyrn. By using the service, you represent
            and warrant that you meet this requirement. We do not knowingly provide services to
            individuals under the age of 18.
          </P>
        </Section>

        <Section title="3. The Service">
          <P>
            Seyrn analyzes the life history and turning points you provide, using AI, to generate
            a personalized pattern analysis report. The service includes:
          </P>
          <UL
            items={[
              "A guided onboarding flow to collect your turning points and personal history",
              "An AI-generated life pattern analysis report",
              "A life graph visualizing your energy and trajectory",
              "A shareable card summarizing your pattern",
              "Permanent access to your report via a unique link sent to your email",
            ]}
          />
          <P>
            The Monthly subscription (coming soon) will additionally include quarterly report
            updates, daily email insights, and pattern tracking over time.
          </P>
        </Section>

        <Section title="4. Not Professional Advice">
          <P>
            Seyrn is a reflective and analytical tool, not a substitute for professional advice.
            The insights and analysis provided are generated by AI based solely on the information
            you submit.
          </P>
          <P>
            <span style={{ color: "var(--cream)", fontWeight: 500 }}>
              Seyrn does not provide:
            </span>
          </P>
          <UL
            items={[
              "Psychological or psychiatric advice or treatment",
              "Financial, investment, or legal advice",
              "Medical advice or diagnosis",
              "Career counseling or professional coaching",
            ]}
          />
          <P>
            You should not rely on Seyrn as a substitute for professional judgment in any area
            that affects your health, finances, or legal obligations. Always consult a qualified
            professional for matters of that nature.
          </P>
        </Section>

        <Section title="5. Accuracy of Information">
          <P>
            The quality and accuracy of your report depends on the accuracy of the information
            you provide during onboarding. You are responsible for providing truthful, accurate
            information to the best of your ability.
          </P>
          <P>
            We do not guarantee that the AI-generated analysis will be accurate, complete, or
            applicable to any particular situation. Pattern analysis is interpretive by nature.
            Treat your report as a reflective tool, not a definitive assessment.
          </P>
        </Section>

        <Section title="6. Payment & Refunds">
          <P>
            The one-time report purchase is priced at $19 USD. Payment is processed securely by
            Lemon Squeezy. By completing a purchase, you authorize the charge to your payment
            method.
          </P>
          <P>
            <span style={{ color: "var(--cream)", fontWeight: 500 }}>Refund policy:</span>
          </P>
          <UL
            items={[
              "Refunds are available within 7 days of purchase if you have not yet viewed your generated report",
              "Once your report has been generated and delivered to your email, the purchase is final",
              "To request a refund, email hello@seyrn.app with your purchase email and order number",
              "Monthly subscription cancellations take effect at the end of the current billing period — no partial refunds",
            ]}
          />
          <P>
            All prices are in USD. We are not responsible for currency conversion fees or charges
            applied by your bank or card issuer.
          </P>
        </Section>

        <Section title="7. Your Content & Data License">
          <P>
            You retain ownership of all personal data and life history you submit to Seyrn. By
            submitting your data, you grant Seyrn a limited license to process and analyze that
            data for the sole purpose of generating your report and providing the service.
          </P>
          <P>
            We do not claim ownership of your data, sell it, or use it to train AI models.
            See our{" "}
            <Link href="/privacy" style={{ color: "var(--gold)", textDecoration: "underline" }}>
              Privacy Policy
            </Link>{" "}
            for full details on how your data is handled.
          </P>
        </Section>

        <Section title="8. Prohibited Uses">
          <P>You agree not to use Seyrn to:</P>
          <UL
            items={[
              "Submit false, misleading, or fraudulent information",
              "Attempt to access, scrape, or reverse-engineer the service or its AI systems",
              "Use the service to generate content about third parties without their consent",
              "Violate any applicable local, national, or international law or regulation",
              "Circumvent payment requirements through technical or other means",
              "Resell, sublicense, or commercially exploit your report or the service without our written consent",
            ]}
          />
        </Section>

        <Section title="9. Intellectual Property">
          <P>
            The Seyrn name, logo, website design, and all original content on seyrn.app are owned
            by Seyrn and protected by applicable intellectual property laws. You may not copy,
            modify, distribute, or create derivative works from our materials without explicit
            written permission.
          </P>
          <P>
            Your report is generated specifically for you. You may share it personally (e.g., via
            your share card or link), but you may not republish, sell, or use it commercially
            without our written consent.
          </P>
        </Section>

        <Section title="10. Third-Party Services">
          <P>
            Seyrn integrates with third-party services including Anthropic (AI), Supabase
            (database), Lemon Squeezy (payments), Resend (email), and Vercel (hosting). Your use
            of these services through Seyrn is also subject to their respective terms and privacy
            policies.
          </P>
          <P>
            We are not responsible for the actions, content, or availability of third-party
            services. Service interruptions from third parties may temporarily affect Seyrn.
          </P>
        </Section>

        <Section title="11. Disclaimer of Warranties">
          <P>
            Seyrn is provided &quot;as is&quot; and &quot;as available&quot; without warranties of
            any kind, either express or implied. We do not warrant that:
          </P>
          <UL
            items={[
              "The service will be uninterrupted, error-free, or secure",
              "The AI analysis will be accurate, complete, or meet your specific expectations",
              "Any defects in the service will be corrected",
              "The service will be available in all geographic locations",
            ]}
          />
          <P>
            To the fullest extent permitted by applicable law, we disclaim all implied warranties,
            including merchantability, fitness for a particular purpose, and non-infringement.
          </P>
        </Section>

        <Section title="12. Limitation of Liability">
          <P>
            To the maximum extent permitted by applicable law, Seyrn and its operators shall not
            be liable for any indirect, incidental, special, consequential, or punitive damages
            arising from your use of — or inability to use — the service, including but not limited
            to loss of data, loss of revenue, or personal harm.
          </P>
          <P>
            Our total liability to you for any claim arising out of or relating to these Terms or
            the service shall not exceed the amount you paid to Seyrn in the 12 months preceding
            the claim.
          </P>
        </Section>

        <Section title="13. Modifications to the Service">
          <P>
            We reserve the right to modify, suspend, or discontinue any part of the service at
            any time, with or without notice. We are not liable to you or any third party for any
            modification, suspension, or discontinuation of the service.
          </P>
          <P>
            For paid reports: if we discontinue the service, we will make reasonable efforts to
            ensure you can export or access your report data before shutdown.
          </P>
        </Section>

        <Section title="14. Changes to These Terms">
          <P>
            We may update these Terms from time to time. When we make material changes, we will
            update the &quot;Last updated&quot; date at the top of this page. For significant changes,
            we will notify active users by email where reasonably practicable.
          </P>
          <P>
            Continued use of Seyrn after updated Terms are posted constitutes your acceptance of
            those Terms.
          </P>
        </Section>

        <Section title="15. Governing Law">
          <P>
            These Terms are governed by and construed in accordance with the laws of the Republic
            of Korea, without regard to its conflict of law provisions. Any disputes arising from
            these Terms or your use of Seyrn shall be subject to the exclusive jurisdiction of
            the courts in Seoul, South Korea.
          </P>
          <P>
            If you are a consumer in a jurisdiction where local consumer protection laws provide
            additional rights, those rights are not affected by this clause.
          </P>
        </Section>

        <Section title="16. Contact">
          <P>
            For questions about these Terms, or to report a violation, contact us at:
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
          <Link href="/privacy" className="font-sans text-xs" style={{ color: "var(--muted)" }}>
            ← Privacy Policy
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
