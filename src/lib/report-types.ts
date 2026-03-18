export interface ReportTheme {
  title: string;
  description: string;
  evidence: string;
}

export interface ReportMove {
  title: string;
  action: string;
}

export interface ForecastYear {
  year: number;
  energy: number;
  theme: string;
}

export interface ReportSection<T> {
  headline: string;
  body?: string;
  data: T;
}

export interface LifePatternData {
  body: string;
}

export interface RecurringThemesData {
  themes: ReportTheme[];
  synthesis: string;
}

export interface NextTurningPointData {
  predicted_year: number;
  energy_forecast: number;
  trigger: string;
  body: string;
}

export interface StrategyData {
  core_insight: string;
  moves: ReportMove[];
  body: string;
}

export interface ActionPlanData {
  timeframes: {
    "90_days": string;
    "6_months": string;
    "1_year": string;
  };
}

export interface LifeForecastData {
  forecast_years: ForecastYear[];
  closing: string;
}

export interface ReportSections {
  life_pattern: { headline: string } & LifePatternData;
  recurring_themes: { headline: string } & RecurringThemesData;
  next_turning_point: { headline: string } & NextTurningPointData;
  strategy: { headline: string } & StrategyData;
  action_plan: { headline: string } & ActionPlanData;
  life_forecast: { headline: string } & LifeForecastData;
}

export interface ReportData {
  pattern_name: string;
  pattern_archetype: string;
  share_sentences?: [string, string];
  sections: ReportSections;
  generated_at: string;
}
