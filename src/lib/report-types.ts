export interface PatternSection {
  summary: string;
  detail: string;
  data_basis: string;
  today: string;
}

export interface NextTurningPoint {
  summary: string;
  timeframe: string;
  detail: string;
  preparation: string;
  today: string;
}

export interface OneThingNow {
  statement: string;
  reason: string;
  today: string;
}

export interface SeasonDiagnosis {
  current: string;
  description: string;
  today: string;
}

export interface PatternWarning {
  summary: string;
  detail: string;
  today: string;
}

export interface ClosingStatement {
  headline: string;
  body: string;
  final_line: string;
}

export interface ReportSections {
  energy_cycle: PatternSection;
  relationship_pattern: PatternSection;
  risk_pattern: PatternSection;
  emotion_pattern: PatternSection;
  next_turning_point: NextTurningPoint;
  one_thing_now: OneThingNow;
  season_diagnosis: SeasonDiagnosis;
  pattern_warning: PatternWarning;
  closing_statement?: ClosingStatement;
}

export interface ReportData {
  pattern_name: string;
  pattern_archetype: string;
  share_sentences?: [string, string];
  sections: ReportSections;
  generated_at: string;
}
