import React from "react";
import styled from "styled-components";

import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { getFilterValueAllowedValues } from "@aca/shared/filters";
import { pluralize } from "@aca/shared/text/pluralize";
import { theme } from "@aca/ui/theme";

import { figmaNotificationOptions } from "./FilterEditorFigma";
import { slackNotificationTypeOptions } from "./FilterEditorSlack";
import { getIsFilterOfType } from "./types";

interface Props {
  filter: NotificationFilter;
}

export function FilterDescriptionLabel({ filter }: Props) {
  if (getIsFilterOfType(filter, "notification_figma_comment")) {
    const typeLabel = figmaNotificationOptions.find((option) => option.isActive(filter))?.label;

    return <>{typeLabel && <UILabel>{typeLabel}</UILabel>}</>;
  }

  if (getIsFilterOfType(filter, "notification_slack_message")) {
    const typeLabel = slackNotificationTypeOptions.find((option) => option.isActive(filter))?.label;

    const peopleCount = getFilterValueAllowedValues(filter.slack_user_id).length;
    return (
      <>
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
        <UILabel>All notifications</UILabel>
      </>
    );
  }

  if (getIsFilterOfType(filter, "notification_linear")) {
    return (
      <>
        <UILabel>All notifications</UILabel>
      </>
    );
  }

  return null;
}

const UILabel = styled.span`
  ${theme.font.secondary};
  font-weight: 400;
`;
