import React from "react";
import styled from "styled-components";

import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { getFilterValueAllowedValues } from "@aca/shared/filters";
import { pluralize } from "@aca/shared/text/pluralize";
import { Button } from "@aca/ui/buttons/Button";
import { theme } from "@aca/ui/theme";

import { figmaNotificationOptions } from "./FilterEditorFigma";
import { slackNotificationTypeOptions } from "./FilterEditorSlack";
import { getIsFilterOfType } from "./types";

interface Props {
  filter: NotificationFilter;
}

export function FilterDescriptionLabel({ filter }: Props) {
  if (getIsFilterOfType(filter, "notification_figma_comment")) {
    const typeLabel = figmaNotificationOptions.find((option) => option.isActive)?.label;

    return (
      <>
        <UIIntegration>Figma</UIIntegration>
        {typeLabel && <UILabel>{typeLabel}</UILabel>}
      </>
    );
  }

  if (getIsFilterOfType(filter, "notification_slack_message")) {
    const typeLabel = slackNotificationTypeOptions.find((option) => option.isActive)?.label;

    const peopleCount = getFilterValueAllowedValues(filter.slack_user_id).length;
    return (
      <>
        <UIIntegration>Slack</UIIntegration> {filter.is_mention}
        {typeLabel && <UILabel>{typeLabel}</UILabel>}
        from
        {peopleCount === 0 && <UILabel>Everyone</UILabel>}
        {peopleCount > 0 && <UILabel>{pluralize`${peopleCount} ${["person"]}`}</UILabel>}
      </>
    );
  }

  if (getIsFilterOfType(filter, "notification_notion")) {
    return (
      <>
        <UIIntegration>Notion</UIIntegration>
      </>
    );
  }

  if (getIsFilterOfType(filter, "notification_linear")) {
    return (
      <>
        <UIIntegration>Linear</UIIntegration>
      </>
    );
  }

  return null;
}

const UIIntegration = styled.strong``;

const UILabel = styled.span`
  ${theme.font.secondary};
  font-weight: 400;
`;
