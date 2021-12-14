import React from "react";
import styled, { css } from "styled-components";

import { Priority_Enum } from "~gql";
import {
  PriorityCriticalIcon,
  PriorityHighIcon,
  PriorityLowIcon,
  PriorityMediumIcon,
  PriorityNoneIcon,
} from "~ui/icons/priorities";

export type Priority = Priority_Enum | null;

export const PriorityIcon = styled<{ priority: Priority; $invert?: boolean }>(({ priority, ...props }) => {
  const Icon = priority
    ? {
        critical: PriorityCriticalIcon,
        high: PriorityHighIcon,
        medium: PriorityMediumIcon,
        low: PriorityLowIcon,
      }[priority]
    : PriorityNoneIcon;

  return <Icon {...props} />;
})`
  ${(props) =>
    !props.$invert &&
    css`
      filter: invert(100%);
    `}
`;
