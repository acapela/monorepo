import { FunctionComponent, ReactNode } from "react";

import { StageConnectTools } from "./StageConnectTools";
import { StageDarkMode } from "./StageDarkMode";
import { StageNotificationsList } from "./StageNotificationsList";
import { StageReadyToGo } from "./StageReadyToGo";
import { StageWelcome } from "./StageWelcome";

export interface OnboardingStageProps {
  onContinue: () => void;
}

export interface OnboardingStage {
  Component: FunctionComponent<OnboardingStageProps>;
  footerNode?: ReactNode;
}

export const onboardingStages: OnboardingStage[] = [
  { Component: StageWelcome },
  { Component: StageDarkMode },
  { Component: StageConnectTools },
  { Component: StageNotificationsList },
  { Component: StageReadyToGo },
];
