import styled from "styled-components";

import { theme } from "@aca/ui/theme";

const SENDERS_WIDTH = 150;

export const UISendersLabel = styled.div`
  ${theme.typo.content.semibold};
  ${theme.common.ellipsisText};
  width: ${SENDERS_WIDTH}px;
  max-width: ${SENDERS_WIDTH}px;
  display: flex;
  align-items: center;
`;

export const UINotificationRowTitle = styled.div`
  ${theme.typo.content.semibold};
  ${theme.common.ellipsisText};
  min-width: 0;
  flex-grow: 1;
  flex-basis: 0;
`;
