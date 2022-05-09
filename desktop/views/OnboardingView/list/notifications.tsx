import React from "react";
import styled from "styled-components";

import { figmaIntegrationClient } from "@aca/desktop/domains/integrations/figma";
import { notionIntegrationClient } from "@aca/desktop/domains/integrations/notion";
import { slackIntegrationClient } from "@aca/desktop/domains/integrations/slack";
import { IconCheck, IconTime } from "@aca/ui/icons";
import { ShortcutDescriptor } from "@aca/ui/keyboard/ShortcutLabel";

import { OnboardingNotificationRowData } from "./types";

const UIShortcut = styled(ShortcutDescriptor)``;

export const onboardingNotificationRows: OnboardingNotificationRowData[] = [
  {
    integration: notionIntegrationClient,
    author: "Adam",
    target: "Q3 Goals",
    content: (
      <>
        Click <IconCheck /> or press <UIShortcut shortcut={"E"} /> to resolve the notification
      </>
    ),
    timeAgoSent: "10m",
  },
  {
    integration: figmaIntegrationClient,
    author: "Nico",
    target: "New Landing",
    content: (
      <>
        Click <IconTime /> or press <UIShortcut shortcut={"H"} /> to snooze the notification
      </>
    ),
    timeAgoSent: "40m",
  },
  {
    integration: slackIntegrationClient,
    author: "Heiki",
    target: "#general",
    content: (
      <>
        Click notification or press <UIShortcut shortcut={"Enter"} /> to open the notification
      </>
    ),
    timeAgoSent: "1hr",
  },
];
