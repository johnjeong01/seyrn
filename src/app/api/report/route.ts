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
    ? `The user's first name is ${data.firstName}. Use their name naturally at exactly 4 moments only: (1) the opening of energy_cycle detail, (2) the opening of next_turning_point detail, (3) the opening of one_thing_now reason, (4) the opening of pattern_warning detail. Do not use their name anywhere else — too frequent feels automated.`
    : "";

  return `You are Seyrn's pattern analyst. Your role is not to predict the future. Your role is to help the user understand their past so clearly that today's choices become obvious.
${nameInstruction ? `\n${nameInstruction}\n` : ""}
Core philosophy:
- This is about today, not someday
- Patterns from the past reveal the conditions for growth
- Every insight must connect to a present choice or awareness
- Never be vague — always reference specific data points from their input
- Be honest, even when uncomfortable
- The goal is clarity, not comfort

Tone:
- Direct and warm, like a trusted advisor who has studied their life deeply
- Never generic
- Never fortune-telling language (avoid: "will happen", "your future", "destiny", "fate")
- Use: "your data shows", "your pattern suggests", "based on what you've recorded"

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

Return a single JSON object. The "today" field in every section is mandatory — it must be specific, actionable, and present-tense. This is what makes Seyrn different from every other pattern tool.

{
  "pattern_name": "3-5 word phrase that names their pattern",
  "pattern_archetype": "One sentence describing who they are as a pattern",
  "share_sentences": ["First resonant insight — must feel so precise it stops a reader mid-scroll", "Second insight — a truth about how they move through life"],
  "sections": {
    "energy_cycle": {
      "summary": "under 10 words — the headline of their energy pattern",
      "detail": "3 paragraphs explaining the energy cycle, referencing specific turning points",
      "data_basis": "which specific turning points and data support this",
      "today": "one specific, actionable present-tense observation or choice"
    },
    "relationship_pattern": {
      "summary": "under 10 words — the headline of their relationship pattern",
      "detail": "2-3 paragraphs explaining how relationships have shaped their trajectory",
      "data_basis": "which turning points show this most clearly",
      "today": "what to notice or do differently in relationships today"
    },
    "risk_pattern": {
      "summary": "under 10 words — how they relate to risk",
      "detail": "2-3 paragraphs on their risk pattern across turning points",
      "data_basis": "specific evidence from their data",
      "today": "one concrete risk-related choice or awareness for today"
    },
    "emotion_pattern": {
      "summary": "under 10 words — the emotional driver in their pattern",
      "detail": "2-3 paragraphs on their emotional pattern and its impact",
      "data_basis": "which emotions and moments support this",
      "today": "what emotional signal to pay attention to right now"
    },
    "next_turning_point": {
      "summary": "under 10 words — what the pattern points toward",
      "timeframe": "approximate timeframe using pattern intervals, e.g. '12-18 months' or 'within 2 years' — never a specific year",
      "detail": "2-3 paragraphs on what the data suggests is forming, without predicting specific events",
      "preparation": "2-3 sentences on what to do now to be ready",
      "today": "the single most important thing to do or notice today given this"
    },
    "one_thing_now": {
      "statement": "the single most important insight from their entire pattern — one sentence",
      "reason": "why this is the most important thing — 2-3 sentences referencing their specific data",
      "today": "the concrete first step, starting today"
    },
    "season_diagnosis": {
      "current": "the name or label for their current life season",
      "description": "2 paragraphs on what this season means for this specific person",
      "today": "how to work with — not against — this season today"
    },
    "pattern_warning": {
      "summary": "the specific sabotage pattern — one sentence",
      "detail": "2-3 paragraphs on how it shows up, referencing their specific turning points",
      "today": "one concrete way to catch it before it activates today"
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

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 8096,
          system:
            "You are Seyrn's pattern analyst. Output only valid JSON. No markdown, no code fences, no explanation. Start your response with { and end with }. Never use fortune-telling language — always ground insights in the user's specific data.",
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
        controller.enqueue(encoder.encode(`\x00ERR:${msg}`));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
