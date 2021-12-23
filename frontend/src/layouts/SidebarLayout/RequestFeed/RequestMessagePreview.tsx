import { RefObject } from "react";
import styled, { css } from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicEntity } from "~frontend/clientdb/topic";
import { MessageText } from "~frontend/message/display/types/TextMessageContent";
import { getStyledMentionForUserSelector } from "~frontend/message/extensions/mentions/TypedMention";
import { MessageLikeContent } from "~frontend/message/feed/MessageLikeContent";
import { UIMessagePreview } from "~frontend/message/UIMessagePreview";
import { styledObserver } from "~shared/component";
import { MENTION_TYPE_LABELS, MentionType } from "~shared/requests";
import { PopPresenceAnimator } from "~ui/animations";
import { Popover, PopoverPlacement } from "~ui/popovers/Popover";
import { theme } from "~ui/theme";
import { wiggleAnimation } from "~ui/wiggle";

interface Props {
  topic: TopicEntity;
  placement?: PopoverPlacement;
  maxLines?: number;
  anchorRef: RefObject<HTMLElement>;
}

export const RequestMessagePreview = styledObserver(function RequestMessagePreview({
  topic,
  placement,
  maxLines = 20,
  anchorRef,
}: Props) {
  const currentUser = useAssertCurrentUser();
  const lastCurrentUserTask = topic.tasks.query({ isAssignedToSelf: true, isDone: false }).last;

  if (!lastCurrentUserTask?.type || !lastCurrentUserTask.message) {
    return null;
  }

  const messageToPreview = lastCurrentUserTask.message;

  if (!messageToPreview.user) return null;

  return (
    <Popover anchorRef={anchorRef} placement={placement}>
      <UIHolder $currentUserId={currentUser.id}>
        <UIHint>
          <strong>{MENTION_TYPE_LABELS[lastCurrentUserTask.type as MentionType]}</strong> task from{" "}
          <strong>{messageToPreview.user.name}</strong>:
        </UIHint>

        <MessageLikeContent user={messageToPreview.user} date={new Date(messageToPreview.created_at)}>
          <UIMessagePreview $maxLines={maxLines}>
            <MessageText content={messageToPreview.content} />
          </UIMessagePreview>
        </MessageLikeContent>
      </UIHolder>
    </Popover>
  );
})``;

const UIHolder = styled(PopPresenceAnimator)<{ $currentUserId: string }>`
  ${theme.colors.layout.background.asBgWithReadableText};

  ${theme.radius.panel};
  ${theme.shadow.popover};
  ${theme.box.previewPopover};

  max-width: 450px;

  display: flex;
  flex-direction: column;
  ${theme.spacing.sections.asGap};

  ${(props) => {
    return css`
      & ${getStyledMentionForUserSelector(props.$currentUserId)} {
        display: inline-block;
        animation: ${wiggleAnimation} 1.5s both infinite;
      }
    `;
  }}
`;

const UIHint = styled.div`
  ${theme.typo.content};
  strong {
    ${theme.font.medium};
  }
`;
