"use client";

interface Props {
  name?: string | null;
}

export default function DailyInsightSample({ name }: Props) {
  const displayName = name?.trim() || "You";
  const today = new Date()
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    .toUpperCase();

  return (
    <div
      style={{
        background: "#1a1814",
        border: "1px solid rgba(201,168,76,0.3)",
        borderRadius: "4px",
        padding: "2rem 2.5rem",
      }}
    >
      {/* Header */}
      <p
        className="font-sans uppercase tracking-[0.22em]"
        style={{ fontSize: "0.65rem", color: "var(--gold)", marginBottom: "1rem" }}
      >
        What Daily Seyrn Looks Like
      </p>
      <div style={{ height: "1px", background: "rgba(201,168,76,0.2)", marginBottom: "2rem" }} />

      {/* Sample insight card */}
      <div
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "3px",
          padding: "1.5rem",
          marginBottom: "1.75rem",
        }}
      >
        <p
          className="font-sans uppercase tracking-[0.18em]"
          style={{ fontSize: "0.55rem", color: "var(--muted)", marginBottom: "1.25rem" }}
        >
          Daily Insight · {today}
        </p>

        <div style={{ marginBottom: "1.25rem" }}>
          <p
            className="font-sans font-light text-sm leading-relaxed"
            style={{ color: "var(--cream)", marginBottom: "0.75rem" }}
          >
            <span style={{ fontWeight: 500 }}>{displayName}</span>, your energy has been
            declining for 8 days.
          </p>
          <p
            className="font-sans font-light text-sm leading-relaxed"
            style={{ color: "var(--warm)", marginBottom: "0.75rem" }}
          >
            Your data shows this exact pattern preceded your biggest life moves — each time,
            you acted before you were ready.
          </p>
          <p
            className="font-sans font-light text-sm leading-relaxed"
            style={{ color: "var(--warm)" }}
          >
            Something is forming. Don&apos;t decide yet.
          </p>
        </div>

        <div
          style={{
            borderLeft: "3px solid var(--gold)",
            background: "rgba(201,168,76,0.05)",
            padding: "0.75rem 1rem",
          }}
        >
          <p
            className="font-sans uppercase tracking-[0.18em]"
            style={{ fontSize: "0.55rem", color: "var(--gold)", marginBottom: "0.5rem" }}
          >
            Today&apos;s Focus
          </p>
          <p
            className="font-sans text-sm leading-relaxed"
            style={{ color: "var(--cream)", fontStyle: "italic" }}
          >
            Identify the decision you are unconsciously preparing to make. Write it down.
            Don&apos;t act on it yet.
          </p>
        </div>
      </div>

      {/* Caption */}
      <p
        className="font-sans text-xs leading-relaxed text-center"
        style={{ color: "var(--muted)", fontStyle: "italic", marginBottom: "2rem" }}
      >
        This is what arrives in your inbox every morning — built from your data, updated as
        your pattern evolves.
      </p>

      {/* Accuracy timeline */}
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
              "7 turning points analyzed",
              "Pattern foundation established",
              "Accuracy: baseline",
            ],
          },
          {
            day: "Day 30",
            lines: [
              "30 daily entries added",
              "Weekly rhythm identified",
              "Burnout predicted 2 weeks early",
              "Accuracy: sharper",
            ],
          },
          {
            day: "Day 90",
            lines: [
              "Full cycle data",
              "Decision patterns mapped",
              '"You decide best on Wednesdays"',
              "Accuracy: precise",
            ],
          },
        ].map(({ day, lines }) => (
          <div key={day}>
            <p
              className="font-sans uppercase tracking-[0.15em]"
              style={{ fontSize: "0.6rem", color: "var(--gold)", marginBottom: "0.6rem" }}
            >
              {day}
            </p>
            {lines.map((line, i) => (
              <p
                key={i}
                className="font-sans"
                style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.65 }}
              >
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Closing line */}
      <p
        className="font-serif font-light text-center"
        style={{
          fontSize: "clamp(1rem, 2vw, 1.2rem)",
          color: "var(--cream)",
          fontStyle: "italic",
          lineHeight: 1.6,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: "1.5rem",
        }}
      >
        The longer you record, the more it knows.
        <br />
        The more it knows, the better your choices become.
      </p>
    </div>
  );
}
