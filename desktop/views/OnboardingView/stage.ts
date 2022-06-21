import { FunctionComponent, ReactNode } from "react";

import { StageCompose } from "./StageCompose";
import { StageConnectTools } from "./StageConnectTools";
import { StageDarkMode } from "./StageDarkMode";
import { StageDesktopNotifications } from "./StageDesktopNotifications";
import { StageFocusMode } from "./StageFocusMode";
import { StageImportantFilters } from "./StageImportantFilters";
import { StageNotificationsList } from "./StageNotificationsList";
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
  { Component: StageCompose },
  { Component: StageImportantFilters },
  { Component: StageDesktopNotifications },
];
