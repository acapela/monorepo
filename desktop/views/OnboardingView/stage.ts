import { FunctionComponent, ReactNode } from "react";

import { StageConnectTools } from "./StageConnectTools";
import { StageDarkMode } from "./StageDarkMode";
import { StageFocusMode } from "./StageFocusMode";
import { StageNotificationsList } from "./StageNotificationsList";
import { StageReadyToGo } from "./StageReadyToGo";
import { StageWelcome } from "./StageWelcome";

export interface OnboardingStageProps {
  onContinue: () => void;
  continueLabel?: string;
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
  { Component: StageFocusMode },
  { Component: StageReadyToGo },
];
