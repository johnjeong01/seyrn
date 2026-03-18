import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { OnboardingData } from "@/lib/onboarding-types";
import type { ReportData } from "@/lib/report-types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

function buildPrompt(data: OnboardingData): string {
  const tpDescriptions = data.turningPoints
    .filter((tp) => tp.year !== null && tp.title.length > 0)
    .map((tp, i) => {
      const emotions = tp.emotions.join(", ");
      return `Turning Point ${i + 1} (${tp.year}): "${tp.title}"
  - Category: ${tp.category ?? "unspecified"}
  - Energy level at the time: ${tp.energyLevel}/10
  - Dominant emotions: ${emotions || "not specified"}
  - Who was present: ${tp.personType ?? "not specified"}
  - Outcome: ${tp.outcome ?? "not specified"}
  - How long it lasted: ${tp.duration ?? "not specified"}`;
    })
    .join("\n\n");

  const goalLabels: Record<string, string> = {
    "career-peak": "reaching a career peak",
    "financial-freedom": "achieving financial freedom",
    "meaningful-relationships": "building meaningful relationships",
    "health-energy": "optimizing health & energy",
    "create-own": "creating something of my own",
  };
  const goals = data.goals.map((g) => goalLabels[g] ?? g).join(", ");

  const changeMap: Record<string, string> = {
    "prepare-advance": "prepares in advance",
    "adapt-arrival": "adapts when change arrives",
    "avoid-delay": "avoids or delays",
    "lean-in": "leans in aggressively",
  };
  const energyMap: Record<string, string> = {
    "starting-new": "starting something new",
    "results-visible": "when results become visible",
    "with-others": "collaborating with others",
    "deep-focus": "in deep solo focus",
  };
  const burnoutMap: Record<string, string> = {
    sleep: "sleep changes",
    withdrawing: "withdrawing socially",
    reactive: "becoming emotionally reactive",
    "future-stops": "losing sight of the future",
  };
  const growthMap: Record<string, string> = {
    "direct-advice": "someone who gave direct advice",
    "silent-example": "someone who led by silent example",
    competitor: "a competitor or rival",
    "stayed-failure": "someone who stayed through failure",
  };

  return `You are a life pattern analyst. Analyze this person's life data and generate a deep, personalized Life Pattern Report.

PERSON PROFILE:
- Current age: ${data.currentAge}, planning to age: ${data.futureAge}
- Current life season: ${data.currentSeason ?? "not specified"}

TURNING POINTS:
${tpDescriptions}

PATTERN SEEDS (Stage 3):
- Repeated mistake or pattern: "${data.repeatedMistake}"
- Peak moments description: "${data.peakMoments}"
- Most impactful type of person in growth: ${data.growthPersonType ? growthMap[data.growthPersonType] : "not specified"}

FUTURE ORIENTATION (Stage 4):
- Primary goals: ${goals}
- Core fear: "${data.fear}"
- Biggest regret: "${data.regret}"

BEHAVIORAL CALIBRATION (Stage 5):
- Response to change: ${data.changeResponse ? changeMap[data.changeResponse] : "not specified"}
- Energy peaks when: ${data.energyPeak ? energyMap[data.energyPeak] : "not specified"}
- First burnout signal: ${data.burnoutSignal ? burnoutMap[data.burnoutSignal] : "not specified"}

Generate a Life Pattern Report as a single JSON object. Be deeply personal, specific to their data, and avoid generic statements. Write in second person ("you", "your"). Each section should feel like it was written by an analyst who truly studied this person.

Return ONLY valid JSON matching this exact schema (no markdown, no explanation, just JSON):

{
  "pattern_name": "A 3-5 word phrase naming their life pattern (e.g., 'The Reluctant Pioneer')",
  "pattern_archetype": "One sentence describing the core pattern archetype",
  "sections": {
    "life_pattern": {
      "headline": "Short evocative headline (under 12 words)",
      "body": "3-4 paragraph deep analysis of their life pattern. Be specific — reference their actual turning points, years, and data."
    },
    "recurring_themes": {
      "headline": "Short headline",
      "themes": [
        {
          "title": "Theme name (2-4 words)",
          "description": "What this theme means for them specifically (2-3 sentences)",
          "evidence": "Which turning point(s) demonstrate this theme"
        }
      ],
      "synthesis": "1-2 sentences tying the themes together"
    },
    "next_turning_point": {
      "headline": "Short headline about their predicted next pivot",
      "predicted_year": 2027,
      "energy_forecast": 7,
      "trigger": "One sentence: what category of event will likely trigger the next turning point",
      "body": "2-3 paragraphs analyzing what their next turning point will look and feel like, based on their patterns"
    },
    "strategy": {
      "headline": "Short strategic headline",
      "core_insight": "One sentence — the single most important strategic insight for this person",
      "moves": [
        {
          "title": "Move name (3-5 words)",
          "action": "Specific action to take (1-2 sentences)"
        }
      ],
      "body": "2 paragraphs of strategic advice, specific to their pattern and goals"
    },
    "action_plan": {
      "headline": "Short headline",
      "timeframes": {
        "90_days": "What to focus on in the next 90 days (2-3 sentences)",
        "6_months": "What to build toward in 6 months (2-3 sentences)",
        "1_year": "Where they should be in 1 year (2-3 sentences)"
      }
    },
    "life_forecast": {
      "headline": "Short headline for the forecast",
      "forecast_years": [
        { "year": 2026, "energy": 7, "theme": "2-4 word theme for that year" }
      ],
      "closing": "2-3 sentences of closing insight — make it memorable and personal"
    }
  }
}

Include exactly 3 recurring themes, exactly 4 strategic moves, and exactly 5 forecast years (starting from current year + 1). The forecast_years energy values should tell a coherent story based on their patterns.`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const body = (await req.json()) as { data: OnboardingData };
    const { data } = body;

    if (!data?.turningPoints?.length) {
      return NextResponse.json(
        { error: "Invalid onboarding data" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(data);

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8096,
      system:
        "You are a life pattern analyst. Output only a single valid JSON object. No markdown, no code blocks, no explanation, no text before or after the JSON.",
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    if (!textContent) {
      return NextResponse.json(
        { error: "No text content in response" },
        { status: 500 }
      );
    }

    // Extract outermost JSON object (strips any accidental wrapper text)
    const start = textContent.indexOf("{");
    const end = textContent.lastIndexOf("}");
    if (start === -1 || end === -1) {
      return NextResponse.json(
        { error: "Invalid response format from Claude" },
        { status: 500 }
      );
    }

    const report = JSON.parse(textContent.slice(start, end + 1)) as ReportData;
    report.generated_at = new Date().toISOString();

    return NextResponse.json({ report });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API error: ${error.message}` },
        { status: error.status ?? 500 }
      );
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
