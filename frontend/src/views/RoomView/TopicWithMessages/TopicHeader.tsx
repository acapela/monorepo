import { gql } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import styled, { css } from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useIsCurrentUserRoomMember } from "~frontend/gql/rooms";
import { withFragments } from "~frontend/gql/utils";
import { useIsCurrentUserTopicManager } from "~frontend/topics/useIsCurrentUserTopicManager";
import { isTopicClosed } from "~frontend/topics/utils";
import { ManageTopic } from "~frontend/views/RoomView/TopicsList/ManageTopic";
import { TopicHeader_RoomFragment, TopicHeader_TopicFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";
import { TextH3 } from "~ui/typo";

import { CloseTopicModal } from "./CloseTopicModal";
import { useUpdateTopic } from "./shared";
import { TopicHeaderDueDate } from "./TopicHeaderDueDate";

const fragments = {
  room: gql`
    ${useIsCurrentUserRoomMember.fragments.room}

    fragment TopicHeader_room on room {
      id
      finished_at
      ...IsCurrentUserRoomMember_room
    }
  `,
  topic: gql`
    ${isTopicClosed.fragments.topic}
    ${useIsCurrentUserTopicManager.fragments.topic}
    ${ManageTopic.fragments.topic}

    fragment TopicHeader_topic on topic {
      id
      name
      archived_at
      ...IsTopicClosed_topic
      ...IsCurrentUserTopicManager_topic
      ...ManageTopic_topic
    }
  `,
};

interface Props {
  room?: TopicHeader_RoomFragment;
  topic: TopicHeader_TopicFragment;
  onCloseTopicRequest?: (summary: string) => void;
  className?: string;
}

const _TopicHeader = ({ room, topic, onCloseTopicRequest }: Props) => {
  const [isClosingTopic, { unset: closeClosingModal, set: openClosingTopicModal }] = useBoolean(false);
  const [updateTopic] = useUpdateTopic();
  const isClosed = Boolean(topic && isTopicClosed(topic));
  const isTopicManager = useIsCurrentUserTopicManager(topic);

  const handleRestoreTopic = () => {
    updateTopic({
      variables: {
        id: topic.id,
        input: { closed_at: null, closed_by_user_id: null, archived_at: null },
      },
    });
    trackEvent("Reopened Topic");
  };

  const handleReopenTopic = () => {
    updateTopic({ variables: { id: topic.id, input: { closed_at: null, closed_by_user_id: null } } });
    trackEvent("Reopened Topic");
  };

  return (
    <UIHolder>
      <UITopicMeta>
        <UITitle isClosed={isClosed}>{topic.name}</UITitle>
        {/* Only display due date when not in a room */}
        {!room && <TopicHeaderDueDate topicId={topic.id} />}
      </UITopicMeta>

      {!room?.finished_at && (
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
          {onCloseTopicRequest && (
            <UIToggleCloseButton onClick={openClosingTopicModal}>Close Topic</UIToggleCloseButton>
          )}
          <ManageTopic topic={topic} />
        </UIActions>
      )}
      <AnimatePresence>
        {isClosingTopic && onCloseTopicRequest && (
          <CloseTopicModal
            loading={false}
            topicId={topic.id}
            onDismissRequest={() => closeClosingModal()}
            onTopicClosed={onCloseTopicRequest}
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

const UITopicMeta = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
