"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type {
  OnboardingData,
  TurningPoint,
  Season,
  TPCategory,
  PersonType,
  Emotion,
  Outcome,
  Duration,
  GrowthPerson,
  Goal,
  ChangeResponse,
  EnergyPeak,
  BurnoutSignal,
} from "@/lib/onboarding-types";
import {
  getInitialData,
  generateSteps,
  createEmptyTP,
} from "@/lib/onboarding-utils";
import {
  STEP_META,
  SEASON_OPTIONS,
  CATEGORY_OPTIONS,
  PERSON_OPTIONS,
  EMOTION_OPTIONS,
  OUTCOME_OPTIONS,
  DURATION_OPTIONS,
  GROWTH_PERSON_OPTIONS,
  GOAL_OPTIONS,
  CHANGE_RESPONSE_OPTIONS,
  ENERGY_PEAK_OPTIONS,
  BURNOUT_OPTIONS,
} from "@/lib/onboarding-config";

import QuestionWrapper from "@/components/onboarding/QuestionWrapper";
import CardPicker      from "@/components/onboarding/inputs/CardPicker";
import MultiCardPicker from "@/components/onboarding/inputs/MultiCardPicker";
import AgeSetup        from "@/components/onboarding/inputs/AgeSetup";
import EnergySlider    from "@/components/onboarding/inputs/EnergySlider";
import YearTitleInput  from "@/components/onboarding/inputs/YearTitleInput";
import TextQuestion    from "@/components/onboarding/inputs/TextQuestion";
import AddMoreTP       from "@/components/onboarding/inputs/AddMoreTP";
import EmailInput      from "@/components/onboarding/inputs/EmailInput";
import NameInput       from "@/components/onboarding/inputs/NameInput";

export default function OnboardingClient() {
  const router = useRouter();
  const [data,    setData]    = useState<OnboardingData>(getInitialData);
  const [stepIdx, setStepIdx] = useState(0);

  const steps       = useMemo(
    () => generateSteps(data.turningPoints.length),
    [data.turningPoints.length]
  );
  const currentStep = steps[stepIdx];

  // Persist to localStorage on every data change
  useEffect(() => {
    localStorage.setItem("seyrn-onboarding-data", JSON.stringify(data));
  }, [data]);

  // Navigate to report when we advance past the last step
  useEffect(() => {
    if (stepIdx >= steps.length) {
      router.push("/report");
    }
  }, [stepIdx, steps, router]);

  const advance = useCallback(() => {
    setStepIdx((prev) => prev + 1);
  }, []);

  const goBack = useCallback(() => {
    setStepIdx((prev) => Math.max(0, prev - 1));
  }, []);

  const jumpToStage = useCallback((firstIdx: number) => {
    setStepIdx(firstIdx);
  }, []);

  const updateData = useCallback((patch: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateTP = useCallback((tpIndex: number, patch: Partial<TurningPoint>) => {
    setData((prev) => {
      const tps = [...prev.turningPoints];
      tps[tpIndex] = { ...tps[tpIndex], ...patch };
      return { ...prev, turningPoints: tps };
    });
  }, []);

  if (!currentStep) return null;

  const meta    = STEP_META[currentStep.id] ?? { context: "", question: "", stageLabel: "" };
  const tpIndex = currentStep.tpIndex ?? 0;
  const tp      = data.turningPoints[tpIndex];

  const firstName = (data.firstName ?? "").trim();

  function renderInput() {
    switch (currentStep.id) {
      case "name-collect":
        return (
          <NameInput
            value={data.firstName ?? ""}
            onComplete={(name) => {
              updateData({ firstName: name });
              advance();
            }}
          />
        );

      case "email-collect":
        return (
          <EmailInput
            value={data.email ?? ""}
            onComplete={(email) => {
              updateData({ email });
              advance();
            }}
          />
        );

      case "age":
        return (
          <AgeSetup
            currentAge={data.currentAge}
            futureAge={data.futureAge}
            onComplete={(cAge, fAge) => {
              updateData({ currentAge: cAge, futureAge: fAge });
              advance();
            }}
          />
        );

      case "season":
        return (
          <CardPicker
            options={SEASON_OPTIONS}
            value={data.currentSeason}
            columns={2}
            onComplete={(v) => {
              updateData({ currentSeason: v as Season });
              advance();
            }}
          />
        );

      case "tp-category":
        return (
          <CardPicker
            options={CATEGORY_OPTIONS}
            value={tp?.category ?? null}
            columns={2}
            onComplete={(v) => {
              updateTP(tpIndex, { category: v as TPCategory });
              advance();
            }}
          />
        );

      case "tp-year-title":
        return (
          <YearTitleInput
            year={tp?.year ?? null}
            title={tp?.title ?? ""}
            currentAge={data.currentAge}
            onComplete={(year, title) => {
              updateTP(tpIndex, { year, title });
              advance();
            }}
          />
        );

      case "tp-energy":
        return (
          <EnergySlider
            value={tp?.energyLevel ?? 5}
            onComplete={(v) => {
              updateTP(tpIndex, { energyLevel: v });
              advance();
            }}
          />
        );

      case "tp-person":
        return (
          <CardPicker
            options={PERSON_OPTIONS}
            value={tp?.personType ?? null}
            columns={2}
            onComplete={(v) => {
              updateTP(tpIndex, { personType: v as PersonType });
              advance();
            }}
          />
        );

      case "tp-emotions":
        return (
          <MultiCardPicker
            options={EMOTION_OPTIONS}
            values={tp?.emotions ?? []}
            max={3}
            minToNext={1}
            onComplete={(vs) => {
              updateTP(tpIndex, { emotions: vs as Emotion[] });
              advance();
            }}
          />
        );

      case "tp-outcome":
        return (
          <CardPicker
            options={OUTCOME_OPTIONS}
            value={tp?.outcome ?? null}
            columns={2}
            onComplete={(v) => {
              updateTP(tpIndex, { outcome: v as Outcome });
              advance();
            }}
          />
        );

      case "tp-duration":
        return (
          <CardPicker
            options={DURATION_OPTIONS}
            value={tp?.duration ?? null}
            columns={2}
            onComplete={(v) => {
              updateTP(tpIndex, { duration: v as Duration });
              advance();
            }}
          />
        );

      case "tp-add-more":
        return (
          <AddMoreTP
            completedCount={tpIndex + 1}
            turningPoints={data.turningPoints}
            onAddMore={() => {
              setData((prev) => ({
                ...prev,
                turningPoints: [...prev.turningPoints, createEmptyTP()],
              }));
              setStepIdx((i) => i + 1);
            }}
            onContinue={advance}
          />
        );

      case "repeated-mistake":
        return (
          <TextQuestion
            value={data.repeatedMistake}
            placeholder="What pattern do you keep finding yourself in..."
            onComplete={(v) => {
              updateData({ repeatedMistake: v });
              advance();
            }}
          />
        );

      case "peak-moments":
        return (
          <TextQuestion
            value={data.peakMoments}
            placeholder="When I look at my best moments, they all share..."
            onComplete={(v) => {
              updateData({ peakMoments: v });
              advance();
            }}
          />
        );

      case "growth-person":
        return (
          <CardPicker
            options={GROWTH_PERSON_OPTIONS}
            value={data.growthPersonType}
            columns={2}
            onComplete={(v) => {
              updateData({ growthPersonType: v as GrowthPerson });
              advance();
            }}
          />
        );

      case "goals":
        return (
          <MultiCardPicker
            options={GOAL_OPTIONS}
            values={data.goals}
            max={3}
            minToNext={1}
            onComplete={(vs) => {
              updateData({ goals: vs as Goal[] });
              advance();
            }}
          />
        );

      case "fear":
        return (
          <TextQuestion
            value={data.fear}
            placeholder="The thing that's been holding me back..."
            onComplete={(v) => {
              updateData({ fear: v });
              advance();
            }}
          />
        );

      case "regret":
        return (
          <TextQuestion
            value={data.regret}
            placeholder="If I'm honest with myself, what I most regret..."
            onComplete={(v) => {
              updateData({ regret: v });
              advance();
            }}
          />
        );

      case "change-response":
        return (
          <CardPicker
            options={CHANGE_RESPONSE_OPTIONS}
            value={data.changeResponse}
            columns={2}
            onComplete={(v) => {
              updateData({ changeResponse: v as ChangeResponse });
              advance();
            }}
          />
        );

      case "energy-peak":
        return (
          <CardPicker
            options={ENERGY_PEAK_OPTIONS}
            value={data.energyPeak}
            columns={2}
            onComplete={(v) => {
              updateData({ energyPeak: v as EnergyPeak });
              advance();
            }}
          />
        );

      case "burnout-signal":
        return (
          <CardPicker
            options={BURNOUT_OPTIONS}
            value={data.burnoutSignal}
            columns={2}
            onComplete={(v) => {
              updateData({ burnoutSignal: v as BurnoutSignal });
              advance();
            }}
          />
        );

      default:
        return null;
    }
  }

  // Personalize context/question with firstName where applicable
  const personalizedQuestion =
    currentStep.id === "email-collect" && firstName
      ? `Good to meet you, ${firstName}. Enter your email to save your results permanently.`
      : currentStep.id === "season" && firstName
      ? `${firstName}, which season best describes where your life is today?`
      : meta.question;

  const isTPSubStep = currentStep.id.startsWith("tp-") && currentStep.id !== "tp-add-more";

  const personalizedContext = isTPSubStep
    ? currentStep.id === "tp-category" && tpIndex === 0
      ? "Turning Point 1 — Oldest first, toward the present"
      : `Turning Point ${tpIndex + 1}`
    : currentStep.id === "email-collect"
    ? "Where should we send your report?"
    : currentStep.id === "repeated-mistake" && firstName
    ? `These three questions reveal the invisible threads running through your story, ${firstName}.`
    : currentStep.id === "change-response" && firstName
    ? `Last three questions, ${firstName}. These calibrate the timing of your predictions.`
    : meta.context;

  return (
    <QuestionWrapper
      key={stepIdx}
      steps={steps}
      currentIdx={stepIdx}
      context={personalizedContext}
      question={personalizedQuestion}
      turningPoints={currentStep.stage === 2 ? data.turningPoints : undefined}
      onBack={stepIdx > 0 ? goBack : undefined}
      onStageClick={jumpToStage}
    >
      {renderInput()}
    </QuestionWrapper>
  );
}
