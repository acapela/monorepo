import styled, { css } from "styled-components";
import { TextH3 } from "~ui/typo";
import { TopicDetailedInfoFragment } from "~gql";
import { Button } from "~ui/buttons/Button";
import { useBoolean } from "~shared/hooks/useBoolean";
import { CloseTopicModal } from "./CloseTopicModal";
import { useTopic } from "~frontend/topics/useTopic";
import { AnimatePresence } from "framer-motion";
import { ManageTopic } from "~frontend/views/RoomView/TopicsList/ManageTopic";
import { isCurrentUserRoomMember } from "~frontend/gql/rooms";

interface Props {
  topic?: TopicDetailedInfoFragment | null;
  className?: string;
}

export const TopicHeader = styled(function TopicHeader({ topic, className }: Props) {
  const [isClosingTopic, { unset: closeClosingModal, set: openClosingTopicModal }] = useBoolean(false);
  const isMember = isCurrentUserRoomMember(topic?.room);

  if (!topic) {
    return <UIHolder className={className}></UIHolder>;
  }

  const { isClosed, isParentRoomOpen, loading, open: openTopic, close: closeTopic } = useTopic(topic);

  if (!isParentRoomOpen) {
    return (
      <UIHolder className={className}>
        <UITitle isClosed={isClosed}>{topic.name}</UITitle>
      </UIHolder>
    );
  }

  return (
    <>
      <UIHolder className={className}>
        <UITitle isClosed={isClosed}>{topic.name}</UITitle>

        <UIActions>
          {isClosed && (
            <UIToggleCloseButton
              onClick={openTopic}
              isLoading={loading}
              isDisabled={!isMember && { reason: `You have to be room member to reopen topics` }}
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
      </UIHolder>
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
    </>
  );
})``;

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UITitle = styled(TextH3)<{ isClosed: boolean }>`
  padding: 0 25%;
  text-align: center;

  ${(props) => {
    if (props.isClosed) {
      return css`
        text-decoration: line-through;
        color: hsla(211, 12%, 62%, 1);
      `;
    }
  }}
`;

const UIActions = styled.div<{}>`
  display: flex;
  right: 0;
  position: absolute;
  align-items: center;
`;

const UIToggleCloseButton = styled(Button)<{}>`
  margin-right: 16px;
`;
