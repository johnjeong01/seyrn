"use client";

interface Props {
  name?: string | null;
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.75rem" }}>
      <p
        className="font-sans uppercase"
        style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: "var(--gold)", marginBottom: "1rem" }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "1.75rem" }} />;
}

export default function DailyInsightSample({ name }: Props) {
  const displayName = name?.trim() || "You";

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* ── MAIN EMAIL CARD ── */}
      <div
        style={{
          background: "#1a1814",
          border: "1px solid rgba(201,168,76,0.25)",
          borderRadius: "4px",
          padding: "clamp(1.5rem, 4vw, 2.5rem)",
        }}
      >
        {/* HEADER BAR */}
        <div
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}
        >
          <span
            className="font-sans"
            style={{ fontSize: "0.6rem", letterSpacing: "0.22em", color: "var(--gold)", fontWeight: 600 }}
          >
            SEYRN
          </span>
          <span
            className="font-sans uppercase"
            style={{ fontSize: "0.55rem", letterSpacing: "0.18em", color: "var(--muted)" }}
          >
            Daily Pattern Report
          </span>
        </div>
        <div style={{ height: "1px", background: "rgba(201,168,76,0.18)", marginBottom: "1.5rem" }} />

        {/* RECIPIENT + DATE */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p className="font-sans text-sm" style={{ color: "rgba(245,240,232,0.55)", marginBottom: "0.4rem" }}>
            For {displayName} · {dateStr}
          </p>
          <p className="font-serif font-light italic" style={{ fontSize: "0.95rem", color: "var(--cream)" }}>
            Day 34 of your pattern journey. 52 entries recorded.
          </p>
        </div>
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "1.75rem" }} />

        {/* SECTION 1 — TODAY'S ENERGY READ */}
        <SectionBlock title="Today's Energy Read">
          <p className="font-sans font-light text-sm leading-relaxed" style={{ color: "var(--cream)", marginBottom: "0.75rem" }}>
            <span style={{ fontWeight: 500 }}>{displayName}</span>, your energy has been declining for 11 consecutive days.
          </p>
          <p className="font-sans font-light text-sm leading-relaxed" style={{ color: "var(--warm)", marginBottom: "0.75rem" }}>
            This is not a warning — it is a signal your data has shown before.
          </p>
          <p className="font-sans font-light text-sm leading-relaxed" style={{ color: "var(--warm)", marginBottom: "0.75rem" }}>
            In 2010 and 2020, this exact pattern preceded your two biggest life moves. Both times,
            you acted before you felt ready. Both times, it was the right call.
          </p>
          <p className="font-sans font-light text-sm leading-relaxed" style={{ color: "var(--warm)" }}>
            Something is forming. Your pattern says: don&apos;t decide yet. Wait 72 hours before any major move.
          </p>
          <div
            style={{
              borderLeft: "3px solid var(--gold)",
              background: "rgba(201,168,76,0.05)",
              padding: "0.75rem 1rem",
              marginTop: "1.25rem",
            }}
          >
            <p className="font-sans uppercase" style={{ fontSize: "0.5rem", letterSpacing: "0.2em", color: "var(--gold)", marginBottom: "0.5rem" }}>
              Today&apos;s Focus
            </p>
            <p className="font-sans text-sm leading-relaxed italic" style={{ color: "var(--cream)" }}>
              Identify the decision you are unconsciously preparing to make. Write it down. One sentence.
              Don&apos;t act on it yet.
            </p>
          </div>
        </SectionBlock>

        <Divider />

        {/* SECTION 2 — PATTERN PULSE */}
        <SectionBlock title="This Week's Pattern Pulse">
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { label: "Energy trend (7 days)",       value: "↓ Declining",        color: "var(--rust)" },
              { label: "Dominant emotion this week",  value: "Anxious + Certain",  color: "var(--cream)" },
              { label: "Pattern on alert",            value: "Decision After Low", color: "var(--gold)" },
              { label: "Days until predicted peak",   value: "~47 days",           color: "var(--sage)" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <span className="font-sans" style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{label}</span>
                <span className="font-sans" style={{ fontSize: "0.75rem", color, fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
          <p className="font-sans italic" style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.75rem" }}>
            These numbers update every day you record.
          </p>
        </SectionBlock>

        <Divider />

        {/* SECTION 3 — PATTERN ALERT */}
        <div style={{ marginBottom: "1.75rem" }}>
          <p className="font-sans uppercase" style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: "var(--rust)", marginBottom: "1rem" }}>
            Pattern Alert
          </p>
          <div style={{ borderLeft: "3px solid var(--rust)", background: "rgba(139,74,47,0.08)", padding: "1rem 1.125rem" }}>
            <p className="font-sans font-light text-sm leading-relaxed" style={{ color: "var(--warm)", marginBottom: "0.75rem" }}>
              <span style={{ fontWeight: 500, color: "var(--cream)" }}>Decision After Low</span> — detected again.
            </p>
            <p className="font-sans font-light text-sm leading-relaxed" style={{ color: "var(--warm)", marginBottom: "0.75rem" }}>
              This pattern has appeared 4 times in {displayName}&apos;s record. Each time: energy below 5,
              a major decision made within 2 weeks, outcome: regret in 3 of 4 cases.
            </p>
            <p className="font-sans font-light text-sm leading-relaxed" style={{ color: "var(--warm)", marginBottom: "0.75rem" }}>
              The one exception was 2014 — when fear was paired with certainty, not confusion.
            </p>
            <p className="font-sans text-sm" style={{ color: "var(--cream)" }}>
              Current state: fear + confusion.{" "}
              <span style={{ color: "var(--rust)" }}>Recommendation: wait.</span>
            </p>
          </div>
        </div>

        <Divider />

        {/* SECTION 4 — THIS MONTH SO FAR */}
        <SectionBlock title="May — 7 Days In">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span className="font-sans" style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Entries recorded: 6 of 7 days
            </span>
            <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--gold)", display: "inline-block" }}
                />
              ))}
              <span
                style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(201,168,76,0.2)", display: "inline-block" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <p className="font-sans" style={{ fontSize: "0.75rem", color: "var(--warm)", lineHeight: 1.6 }}>
              ↑ Avg energy this month: <span style={{ color: "var(--cream)" }}>5.2</span> vs last month:{" "}
              <span style={{ color: "var(--rust)" }}>6.1 (declining)</span>
            </p>
            <p className="font-sans" style={{ fontSize: "0.75rem", color: "var(--warm)", lineHeight: 1.6 }}>
              ⚠ Isolation pattern: <span style={{ color: "var(--cream)" }}>active for 9 days</span>
            </p>
            <p className="font-sans" style={{ fontSize: "0.75rem", color: "var(--warm)", lineHeight: 1.6 }}>
              → Next milestone: <span style={{ color: "var(--gold)" }}>Day 90 full cycle analysis</span>
            </p>
          </div>
        </SectionBlock>

        <Divider />

        {/* SECTION 5 — ONE THING FOR TODAY */}
        <div
          style={{
            background: "rgba(201,168,76,0.06)",
            border: "1px solid rgba(201,168,76,0.2)",
            padding: "1.5rem",
            textAlign: "center",
            marginBottom: "1.75rem",
          }}
        >
          <p className="font-sans uppercase" style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: "var(--gold)", marginBottom: "1rem" }}>
            The One Thing For Today
          </p>
          <p
            className="font-serif font-light"
            style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: "var(--cream)", lineHeight: 1.4, marginBottom: "1rem" }}
          >
            Do not make the decision that is forming in your mind today.
          </p>
          <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
            Based on 34 days of your data, your pattern shows you decide best when energy is rising, not falling.
          </p>
          <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Energy is falling. The decision will still be there in 72 hours. And you will make it better then.
          </p>
        </div>

        {/* BOTTOM BAR */}
        <div style={{ height: "1px", background: "rgba(201,168,76,0.18)", marginBottom: "0.875rem" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="font-sans" style={{ fontSize: "0.6rem", color: "var(--muted)" }}>seyrn.app</span>
          <span className="font-sans" style={{ fontSize: "0.6rem", color: "var(--gold)", letterSpacing: "0.1em" }}>
            View full dashboard →
          </span>
        </div>
      </div>

      {/* CAPTION */}
      <p
        className="font-sans text-xs leading-relaxed text-center italic"
        style={{ color: "var(--muted)", marginTop: "1.5rem", marginBottom: "2rem" }}
      >
        This is what {displayName} receives every morning — built from 34 days of data.
        Yours starts from day one.
      </p>

      {/* ACCURACY TIMELINE */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: "1.5rem",
        }}
      >
        {[
          {
            day: "Day 1",
            lines: [
              "Initial pattern report generated.",
              "7 turning points analyzed.",
              "Brave Mover, Stuck Earner identified.",
              "Baseline established.",
            ],
          },
          {
            day: "Day 30",
            lines: [
              "30 daily entries added.",
              "Isolation Drain pattern confirmed.",
              "Weekly energy rhythm mapped.",
              "First pattern alert triggered.",
            ],
          },
          {
            day: "Day 90",
            lines: [
              "Full cycle data captured.",
              `"Decision After Low" pattern locked.`,
              `${displayName} decides best on Wednesdays.`,
              "Burnout predicted 18 days early.",
            ],
          },
        ].map(({ day, lines }) => (
          <div key={day}>
            <p className="font-sans uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--gold)", marginBottom: "0.6rem" }}>
              {day}
            </p>
            {lines.map((line, i) => (
              <p key={i} className="font-sans" style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.65 }}>
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* TAGLINE */}
      <p
        className="font-serif font-light text-center italic"
        style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "var(--cream)", lineHeight: 1.6, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem" }}
      >
        The longer you record, the more it knows.
        <br />
        The more it knows, the better your choices become.
      </p>
    </div>
  );
}
