import styled from "styled-components";

import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { theme } from "@aca/ui/theme";

const SENDERS_WIDTH = 150;

export const isNotificationSnoozeEnded = ({ snoozed_until, last_seen_at }: NotificationEntity) =>
  snoozed_until && last_seen_at && new Date(snoozed_until).getTime() > new Date(last_seen_at).getTime();

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
`;

export const UINotificationGroupTitle = styled(UINotificationRowTitle)`
  min-width: 0;
  flex-grow: 1;
  flex-basis: 0;
`;

export const UINotificationPreviewText = styled.div`
  ${theme.typo.content.opacity(0.6)};
  ${theme.common.ellipsisText};
  /* @Omar: Not super happy about this one, but it's late and it works */
  /* This accounts for the gap space between items in a notification row */
  margin-left: -18px;
  flex-grow: 1;
  flex-basis: 0;
`;

export const UIUnreadIndicator = styled.div<{ $type: "snooze-ended" | "not-read" }>`
  width: 10px;
  height: 10px;
  ${(props) => (props.$type === "not-read" ? theme.colors.primary.asBg : theme.colors.tags.feedback.asBg)}

  ${theme.radius.circle}
`;
