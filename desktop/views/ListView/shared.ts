import styled from "styled-components";

import { theme } from "@aca/ui/theme";

const SENDERS_WIDTH = 150;

export const UISendersLabel = styled.div`
  ${theme.typo.content.medium};
  ${theme.common.ellipsisText};
  width: ${SENDERS_WIDTH}px;
  max-width: ${SENDERS_WIDTH}px;
  display: flex;
  align-items: center;
`;

export const UINotificationRowTitle = styled.div`
  ${theme.typo.content.medium};
  ${theme.common.ellipsisText};
`;

export const UINotificationGroupTitle = styled(UINotificationRowTitle)`
  min-width: 0;
  flex-grow: 1;
  flex-basis: 0;
`;

export const UINotificationPreviewText = styled.div`
  ${theme.typo.content.opacity(0.6)};
  ${theme.common.ellipsisText};
  flex-grow: 1;
  flex-basis: 0;
`;

export const UIDate = styled.div`
  opacity: 0.6;
  min-width: 4ch;
  text-align: right;
`;
