import React from "react";
import styled from "styled-components";

import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { getFilterValueAllowedValues } from "@aca/shared/filters";
import { isNotNullish } from "@aca/shared/nullish";
import { pluralize } from "@aca/shared/text/pluralize";
import { theme } from "@aca/ui/theme";

import { figmaNotificationOptions } from "./FilterEditorFigma";
import { slackConversationTypeLabels, slackConversationTypes, slackNotificationTypeOptions } from "./FilterEditorSlack";
import { getIsFilterOfType } from "./types";

interface Props {
  filter: NotificationFilter;
}

const PeopleDescription = ({ count }: { count: number }) =>
  count == 0 ? null : (
    <>
      from
      <UILabel>{pluralize`${count} ${["person"]}`}</UILabel>
    </>
  );

export function FilterDescriptionLabel({ filter }: Props) {
  if (getIsFilterOfType(filter, "notification_figma_comment")) {
    const peopleCount = getFilterValueAllowedValues(filter.author_id).length;
    const typeLabel = figmaNotificationOptions.find((option) => option.isActive(filter))?.label;

    return (
      <>
        {typeLabel && <UILabel>{typeLabel}</UILabel>}
        <PeopleDescription count={peopleCount} />
      </>
    );
  }

  if (getIsFilterOfType(filter, "notification_slack_message")) {
    const typeLabel = slackNotificationTypeOptions.find((option) => option.isActive(filter))?.label;
    const peopleCount = getFilterValueAllowedValues(filter.slack_user_id).length;
    const conversationTypes = getFilterValueAllowedValues(filter.conversation_type).filter(
      isNotNullish
    ) as typeof slackConversationTypes;
    const hasThreadFilter = filter.slack_thread_ts !== undefined;
    return (
      <>
        {typeLabel && <UILabel>{typeLabel}</UILabel>}
        <PeopleDescription count={peopleCount} />
        {conversationTypes.length > 0 && (
          <>
            in{" "}
            <UILabel>
              {conversationTypes
                .map((type) => <>{slackConversationTypeLabels[type]}</>)
                .reduce((prev, cur, i, { length }) => (
                  <>
                    {prev} {i + 1 < length ? "," : "and"} {cur}
                  </>
                ))}
            </UILabel>
          </>
        )}
        {hasThreadFilter && <>*</>}
      </>
    );
  }

  if (getIsFilterOfType(filter, "notification_notion")) {
    const peopleCount = getFilterValueAllowedValues(filter.author_id).length;
    return (
      <>
        <UILabel>All notifications</UILabel>
        <PeopleDescription count={peopleCount} />
      </>
    );
  }

  if (getIsFilterOfType(filter, "notification_linear")) {
    const peopleCount = getFilterValueAllowedValues(filter.creator_id).length;
    return (
      <>
        <UILabel>All notifications</UILabel>
        <PeopleDescription count={peopleCount} />
      </>
    );
  }

  return null;
}

const UILabel = styled.span`
  ${theme.font.secondary};
  font-weight: 400;
`;
