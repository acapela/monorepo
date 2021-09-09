import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import styled, { css } from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { RoomEntity } from "~frontend/clientdb/room";
import { TopicEntity } from "~frontend/clientdb/topic";
import { useIsCurrentUserTopicManager } from "~frontend/topics/useIsCurrentUserTopicManager";
import { isTopicClosed } from "~frontend/topics/utils";
import { ManageTopic } from "~frontend/views/RoomView/TopicsList/ManageTopic";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";
import { TextH3 } from "~ui/typo";

import { CloseTopicModal } from "./CloseTopicModal";

interface Props {
  room: RoomEntity;
  topic: TopicEntity;
  className?: string;
}

export const TopicHeader = observer(({ room, topic }: Props) => {
  const [isClosingTopic, { unset: closeClosingModal, set: openClosingTopicModal }] = useBoolean(false);
  const user = useAssertCurrentUser();
  const isMember = room.isCurrentUserMember;
  const isClosed = Boolean(topic && isTopicClosed(topic));
  const isTopicManager = useIsCurrentUserTopicManager(room, topic);

  const handleRestoreTopic = () => {
    topic.update({ closed_at: null, closed_by_user_id: null, archived_at: null });

    trackEvent("Reopened Topic");
  };

  const handleReopenTopic = () => {
    topic.update({ closed_at: null, closed_by_user_id: null });
    trackEvent("Reopened Topic");
  };

  const handleCloseTopic = (topicSummary: string) => {
    topic.update({
      closed_at: new Date().toISOString(),
      closed_by_user_id: user.id,
      closing_summary: topicSummary,
    });

    trackEvent("Closed Topic", { topicId: topic.id });
  };

  return (
    <UIHolder>
      <UITitle isClosed={isClosed}>{topic.name}</UITitle>

      {!room.finished_at && (
        <UIActions>
          {isClosed &&
            (topic.archived_at ? (
              <UIToggleCloseButton
                onClick={handleRestoreTopic}
                isDisabled={!isTopicManager && { reason: `You have to be room or topic owner to restore topics` }}
              >
                Restore Topic
              </UIToggleCloseButton>
            ) : (
              <UIToggleCloseButton
                onClick={handleReopenTopic}
                isDisabled={!isTopicManager && { reason: `You have to be room or topic owner to reopen topics` }}
              >
                Reopen Topic
              </UIToggleCloseButton>
            ))}
          {!isClosed && (
            <UIToggleCloseButton
              onClick={openClosingTopicModal}
              isDisabled={!isMember && { reason: `You have to be room member to close topics` }}
            >
              Close Topic
            </UIToggleCloseButton>
          )}
          {isMember && <ManageTopic room={room} topic={topic} />}
        </UIActions>
      )}
      <AnimatePresence>
        {isClosingTopic && (
          <CloseTopicModal
            loading={false}
            topicId={topic.id}
            onDismissRequest={() => closeClosingModal()}
            onTopicClosed={handleCloseTopic}
          />
        )}
      </AnimatePresence>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 96px;
`;

const UITitle = styled(TextH3)<{ isClosed: boolean }>`
  margin-top: 24px;

  text-align: start;

  align-self: flex-start;

  ${theme.font.h4.spezia.medium.build}

  ${(props) => {
    if (props.isClosed) {
      return css`
        text-decoration: line-through;
        color: ${theme.colors.layout.supportingText()};
      `;
    }
  }}
`;

const UIActions = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UIToggleCloseButton = styled(Button)<{}>``;
