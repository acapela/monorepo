import { AnimatePresence } from "framer-motion";
import styled, { css } from "styled-components";
import { isCurrentUserRoomMember } from "~frontend/gql/rooms";
import { useIsCurrentUserTopicManager } from "~frontend/topics/useIsCurrentUserTopicManager";
import { useTopic } from "~frontend/topics/useTopic";
import { ManageTopic } from "~frontend/views/RoomView/TopicsList/ManageTopic";
import { TopicDetailedInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";
import { TextH3 } from "~ui/typo";
import { CloseTopicModal } from "./CloseTopicModal";

interface Props {
  topic: TopicDetailedInfoFragment;
}

export const TopicHeader = ({ topic }: Props) => {
  const [isClosingTopic, { unset: closeClosingModal, set: openClosingTopicModal }] = useBoolean(false);
  const isMember = isCurrentUserRoomMember(topic.room);
  const isTopicManager = useIsCurrentUserTopicManager(topic);

  const { isClosed, isParentRoomOpen, loading, open: openTopic, close: closeTopic } = useTopic(topic);

  return (
    <UIHolder>
      <UITitle isClosed={isClosed}>{topic.name}</UITitle>

      {isParentRoomOpen && (
        <UIActions>
          {isClosed && (
            <UIToggleCloseButton
              onClick={openTopic}
              isLoading={loading}
              isDisabled={!isTopicManager && { reason: `You have to be room or topic owner to reopen topics` }}
            >
              Reopen Topic
            </UIToggleCloseButton>
          )}
          {!isClosed && (
            <UIToggleCloseButton
              onClick={openClosingTopicModal}
              isDisabled={!isMember && { reason: `You have to be room member to close topics` }}
            >
              Close Topic
            </UIToggleCloseButton>
          )}
          {isMember && <ManageTopic topic={topic} />}
        </UIActions>
      )}
      <AnimatePresence>
        {isClosingTopic && (
          <CloseTopicModal
            topicId={topic.id}
            loading={loading}
            onDismissRequest={() => closeClosingModal()}
            onTopicClosed={(topicSummary) => closeTopic(topicSummary)}
          />
        )}
      </AnimatePresence>
    </UIHolder>
  );
};

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
