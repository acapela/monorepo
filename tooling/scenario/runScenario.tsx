import { render } from "ink";
import React, { useEffect, useState } from "react";

import { ScenarioConfig } from "./config";
import { FullScreen } from "./Fullscreen";
import { StepRunner } from "./runScenarioStep";
import { clearConsole } from "./utils";

export async function runScenario(scenario: ScenarioConfig) {
  const { clear } = render(<ScenarioRunner scenario={scenario} />);
}

interface Props {
  scenario: ScenarioConfig;
}

function ScenarioRunner({ scenario }: Props) {
  const [currentStep, setCurrentStep] = useState(scenario[0]);

  function handleStepFinished() {
    const currentStepIndex = scenario.indexOf(currentStep);
    const nextStep = scenario[currentStepIndex + 1];

    if (nextStep) {
      clearConsole();
      setCurrentStep(nextStep);
    }
  }

  return <StepRunner key={currentStep.commands.join("")} step={currentStep} onFinished={handleStepFinished} />;

  return (
    <FullScreen>
      <StepRunner key={currentStep.commands.join("")} step={currentStep} onFinished={handleStepFinished} />
    </FullScreen>
  );
}
