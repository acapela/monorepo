import { JSONContent } from "@tiptap/react";
import React, { useMemo } from "react";
import styled from "styled-components";

import { getUniqueRequestMentionDataFromContent } from "~shared/editor/mentions";
import { MENTION_TYPE_LABELS, REQUEST_ACTION, REQUEST_DECISION, REQUEST_RESPONSE, RequestType } from "~shared/requests";
import { theme } from "~ui/theme";
import { Toggle } from "~ui/toggle";

type Props = { requestType: RequestType } & React.ComponentProps<typeof Toggle>;

const REQUEST_TYPES_COMPLETABLE_BY_SINGLE_USER = [REQUEST_ACTION, REQUEST_RESPONSE, REQUEST_DECISION] as const;
export const isRequestTypeCompletableBySingleUser = (
  value: unknown
): value is typeof REQUEST_TYPES_COMPLETABLE_BY_SINGLE_USER[number] =>
  REQUEST_TYPES_COMPLETABLE_BY_SINGLE_USER.includes(value as never);

export function useSingleRequestTypeForManyUsers(content: JSONContent) {
  const mentionData = useMemo(() => getUniqueRequestMentionDataFromContent(content), [content]);
  return mentionData.length > 1 && new Set(mentionData.map((data) => data.type)).size == 1 && mentionData[0].type;
}

export const FirstCompletionEnoughToggle = ({ requestType, ...props }: Props) => (
  <UIToggleLabel>
    <Toggle size="small" {...props} />
    First <UIBold>{MENTION_TYPE_LABELS[requestType]}</UIBold> marks all as done
  </UIToggleLabel>
);

const UIToggleLabel = styled.label<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  white-space: pre;

  cursor: pointer;

  & > :first-child {
    margin-right: 5px;
  }
`;

const UIBold = styled.span<{}>`
  ${theme.font.semibold}
`;
