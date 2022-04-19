import React from "react";
import styled from "styled-components";

import { slackIntegrationClient } from "@aca/desktop/domains/integrations/slack";
import { IconCheck, IconTime } from "@aca/ui/icons";
import { ShortcutDescriptor } from "@aca/ui/keyboard/ShortcutLabel";

import { OnboardingNotificationRowData } from "./types";

const UIShortcut = styled(ShortcutDescriptor)``;

export const onboardingNotificationRows: OnboardingNotificationRowData[] = [
  {
    integration: slackIntegrationClient,
    author: "Heiki",
    target: "#welcome",
    content: (
      <>
        Click <IconCheck /> or press <UIShortcut shortcut={"E"} /> to resolve notification
      </>
    ),
  },
  {
    integration: slackIntegrationClient,
    author: "Heiki",
    target: "#welcome",
    content: (
      <>
        Click <IconTime /> or press <UIShortcut shortcut={"H"} /> to snooze notification
      </>
    ),
  },
  {
    integration: slackIntegrationClient,
    author: "Heiki",
    target: "#welcome",
    content: (
      <>
        Click notification or press <UIShortcut shortcut={"Enter"} /> to open notification
      </>
    ),
  },
];
