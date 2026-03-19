// Step metadata (context sentences + question headlines)

export interface StepMeta {
  context:    string;
  question:   string;
  stageLabel: string;
}

export const STEP_META: Record<string, StepMeta> = {
  "email-collect": {
    context:    "Before we begin,",
    question:   "Where should we send your report?",
    stageLabel: "Access",
  },
  age: {
    context:    "Your life graph starts here. Let's decide how far we're looking.",
    question:   "How old are you, and how far into the future would you like to see?",
    stageLabel: "Life Coordinates",
  },
  season: {
    context:    "Right now, you're somewhere in a cycle.",
    question:   "Which season best describes where your life is today?",
    stageLabel: "Life Coordinates",
  },
  "tp-category": {
    context:    "Think of a specific moment that changed the direction of your life.",
    question:   "What kind of turning point was this?",
    stageLabel: "Turning Points",
  },
  "tp-year-title": {
    context:    "Every turning point has a year it began.",
    question:   "When did it happen, and what would you call it?",
    stageLabel: "Turning Points",
  },
  "tp-energy": {
    context:    "Not how hard you worked — how alive you felt.",
    question:   "What was your energy level during this period?",
    stageLabel: "Turning Points",
  },
  "tp-person": {
    context:    "The people around us shape how we move through change.",
    question:   "Who was with you during this turning point?",
    stageLabel: "Turning Points",
  },
  "tp-emotions": {
    context:    "Turning points carry a specific emotional signature.",
    question:   "What emotions dominated this period? Pick up to three.",
    stageLabel: "Turning Points",
  },
  "tp-outcome": {
    context:    "Every turning point has an aftermath.",
    question:   "What happened to you after this period ended?",
    stageLabel: "Turning Points",
  },
  "tp-duration": {
    context:    "The length of a turning point tells us something about how you process change.",
    question:   "How long did this turning point period last?",
    stageLabel: "Turning Points",
  },
  "tp-add-more": {
    context:    "The more turning points you give us, the sharper your pattern.",
    question:   "Would you like to add another turning point?",
    stageLabel: "Turning Points",
  },
  "repeated-mistake": {
    context:    "These three questions reveal the invisible threads running through your story.",
    question:   "What situation or mistake keeps repeating in your life?",
    stageLabel: "Pattern Seeds",
  },
  "peak-moments": {
    context:    "Your best moments share a hidden structure.",
    question:   "What do your best moments have in common?",
    stageLabel: "Pattern Seeds",
  },
  "growth-person": {
    context:    "The people who grew you most left a specific kind of mark.",
    question:   "What type of person has grown you the most?",
    stageLabel: "Pattern Seeds",
  },
  goals: {
    context:    "The past reveals your pattern. Your answers here shape your forecast.",
    question:   "What must you achieve in the next five years?",
    stageLabel: "Future Coordinates",
  },
  fear: {
    context:    "What holds you back tells us as much as what drives you forward.",
    question:   "What's the biggest thing holding you back right now?",
    stageLabel: "Future Coordinates",
  },
  regret: {
    context:    "Regret is a map of what matters most to you.",
    question:   "What's your most significant regret?",
    stageLabel: "Future Coordinates",
  },
  "change-response": {
    context:    "Last three questions. These calibrate the timing of your predictions.",
    question:   "How do you typically meet big change?",
    stageLabel: "Cycle Calibration",
  },
  "energy-peak": {
    context:    "Your natural energy rhythm shapes everything that follows.",
    question:   "When is your energy naturally highest?",
    stageLabel: "Cycle Calibration",
  },
  "burnout-signal": {
    context:    "Knowing your early warning signs is how you stay ahead of the pattern.",
    question:   "What's the first sign you're burning out?",
    stageLabel: "Cycle Calibration",
  },
};

// ── Option sets ─────────────────────────────────────────────────

export interface Option {
  value:       string;
  label:       string;
  description: string;
  icon?:       string;
}

export const SEASON_OPTIONS: Option[] = [
  { value: "spring", icon: "🌱", label: "Spring", description: "Planting seeds — results not yet visible" },
  { value: "summer", icon: "☀️", label: "Summer", description: "In full growth — high energy and effort" },
  { value: "autumn", icon: "🍂", label: "Autumn", description: "Harvesting — things are coming together" },
  { value: "winter", icon: "❄️", label: "Winter", description: "Resting — rebuilding for what's next" },
];

export const CATEGORY_OPTIONS: Option[] = [
  { value: "career",        icon: "◈", label: "Career / Work",         description: "A job, project, or professional shift" },
  { value: "relationship",  icon: "◉", label: "Relationship / People", description: "Someone who changed your direction" },
  { value: "place",         icon: "◎", label: "Place / Environment",   description: "A move or major context change" },
  { value: "inner-shift",   icon: "◌", label: "Inner Shift",           description: "A belief or identity that transformed" },
  { value: "loss-failure",  icon: "◍", label: "Loss / Failure",        description: "Something that broke or ended" },
  { value: "leap-success",  icon: "◆", label: "Leap / Success",        description: "A breakthrough or major win" },
];

export const PERSON_OPTIONS: Option[] = [
  { value: "mentor",  label: "A mentor",  description: "Someone who guided and believed in you" },
  { value: "partner", label: "A partner", description: "Someone who fought alongside you" },
  { value: "rival",   label: "A rival",   description: "Someone who pushed you to level up" },
  { value: "alone",   label: "No one",    description: "You faced this alone" },
];

export const EMOTION_OPTIONS: Option[] = [
  { value: "excitement", label: "Excitement", description: "" },
  { value: "fear",       label: "Fear",        description: "" },
  { value: "certainty",  label: "Certainty",   description: "" },
  { value: "confusion",  label: "Confusion",   description: "" },
  { value: "anger",      label: "Anger",       description: "" },
  { value: "peace",      label: "Peace",       description: "" },
];

export const OUTCOME_OPTIONS: Option[] = [
  { value: "grew",               label: "I grew significantly",         description: "This period expanded who I am" },
  { value: "stagnated",          label: "I stagnated",                  description: "I stayed in place, neither growing nor shrinking" },
  { value: "direction-changed",  label: "My direction changed completely", description: "I ended up somewhere entirely different" },
  { value: "fell-apart-rebuilt", label: "I fell apart, then rebuilt",   description: "It broke me before it made me stronger" },
];

export const DURATION_OPTIONS: Option[] = [
  { value: "under-3mo", label: "Under 3 months", description: "A sharp, fast shift" },
  { value: "6mo",       label: "Around 6 months", description: "A season of transition" },
  { value: "1yr",       label: "About a year",    description: "A full cycle of change" },
  { value: "over-1yr",  label: "Over a year",     description: "A slow, deep transformation" },
];

export const GROWTH_PERSON_OPTIONS: Option[] = [
  { value: "direct-advice",     label: "Direct challenger", description: "Someone who gave direct advice and challenged you" },
  { value: "silent-example",    label: "Silent model",      description: "Someone whose example silently inspired you" },
  { value: "competitor",        label: "Rival",             description: "Someone who competed with you and raised your game" },
  { value: "stayed-failure",    label: "Steady presence",   description: "Someone who stayed through your failures" },
];

export const GOAL_OPTIONS: Option[] = [
  { value: "career-peak",              label: "Career peak",              description: "Reach the height of my professional impact" },
  { value: "financial-freedom",        label: "Financial freedom",        description: "Never make decisions out of financial pressure" },
  { value: "meaningful-relationships", label: "Meaningful relationships", description: "Build connections that truly matter" },
  { value: "health-energy",            label: "Health and energy",        description: "Sustain high physical and mental capacity" },
  { value: "create-own",               label: "Something I own",          description: "Build or create something that is entirely mine" },
];

export const CHANGE_RESPONSE_OPTIONS: Option[] = [
  { value: "prepare-advance", label: "I prepare in advance", description: "I research, plan, and meet change ready" },
  { value: "adapt-arrival",   label: "I adapt when it arrives", description: "I stay flexible and adjust as I go" },
  { value: "avoid-delay",     label: "I tend to delay it",     description: "Change is uncomfortable — I sometimes avoid it" },
  { value: "lean-in",         label: "Change energizes me",    description: "I lean in — transitions feel like openings" },
];

export const ENERGY_PEAK_OPTIONS: Option[] = [
  { value: "starting-new",    label: "Starting something new",       description: "The blank page gives me energy" },
  { value: "results-visible", label: "When results become visible",  description: "Momentum and proof fuel me" },
  { value: "with-others",     label: "Working closely with others",  description: "People bring out my best" },
  { value: "deep-focus",      label: "Deep, uninterrupted focus",    description: "Solitude and depth are where I thrive" },
];

export const BURNOUT_OPTIONS: Option[] = [
  { value: "sleep",          label: "Sleep disruption",          description: "My sleep becomes irregular or shallow" },
  { value: "withdrawing",    label: "Social withdrawal",         description: "I start pulling away from people I care about" },
  { value: "reactive",       label: "Disproportionate reaction", description: "Small things trigger outsized responses" },
  { value: "future-stops",   label: "The future goes quiet",     description: "I stop being able to imagine what's ahead" },
];
