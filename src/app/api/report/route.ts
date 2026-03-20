import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { OnboardingData } from "@/lib/onboarding-types";

export const maxDuration = 300;
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

  const nameInstruction = data.firstName
    ? `The user's first name is ${data.firstName}. Use their name naturally at exactly 4 moments only: (1) the opening line of life_pattern body, (2) the opening of next_turning_point body, (3) the opening of strategy core_insight, (4) the opening of action_plan 90_days. Do not use their name anywhere else — too frequent feels automated.`
    : "";

  return `You are a life pattern analyst. Analyze this person's life data and generate a deep, personalized Life Pattern Report.
${nameInstruction ? `\n${nameInstruction}\n` : ""}
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

Return a single JSON object with this exact structure. Include exactly 3 themes, 4 moves, 5 forecast years (from next year):

{
  "pattern_name": "3-5 word phrase",
  "pattern_archetype": "One sentence",
  "share_sentences": ["First resonant insight about this specific person's pattern — must feel so precise it stops a reader mid-scroll", "Second insight — a truth about how they move through life that makes any observer think: I wonder what mine says"],
  "sections": {
    "life_pattern": { "headline": "under 12 words", "body": "3-4 paragraphs" },
    "recurring_themes": {
      "headline": "short headline",
      "themes": [{ "title": "2-4 words", "description": "2-3 sentences", "evidence": "which turning point" }],
      "synthesis": "1-2 sentences"
    },
    "next_turning_point": {
      "headline": "short headline",
      "predicted_year": 2027,
      "energy_forecast": 7,
      "trigger": "one sentence",
      "body": "2-3 paragraphs"
    },
    "strategy": {
      "headline": "short headline",
      "core_insight": "one sentence",
      "moves": [{ "title": "3-5 words", "action": "1-2 sentences" }],
      "body": "2 paragraphs"
    },
    "action_plan": {
      "headline": "short headline",
      "timeframes": { "90_days": "2-3 sentences", "6_months": "2-3 sentences", "1_year": "2-3 sentences" }
    },
    "life_forecast": {
      "headline": "short headline",
      "forecast_years": [{ "year": 2026, "energy": 7, "theme": "2-4 words" }],
      "closing": "2-3 sentences"
    }
  }
}`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let data: OnboardingData;
  try {
    const body = (await req.json()) as { data: OnboardingData };
    data = body.data;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!data?.turningPoints?.length) {
    return NextResponse.json({ error: "Invalid onboarding data" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });
  const prompt = buildPrompt(data);
  const encoder = new TextEncoder();

  // Stream Claude's response directly to the client.
  // Assistant prefill with "{" forces Claude to output pure JSON from the start.
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 8096,
          system:
            "You are a life pattern analyst. Output only valid JSON. No markdown, no code fences, no explanation. Start your response with { and end with }.",
          messages: [{ role: "user", content: prompt }],
        });

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        // Signal error to client via a special marker
        controller.enqueue(encoder.encode(`\x00ERR:${msg}`));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
