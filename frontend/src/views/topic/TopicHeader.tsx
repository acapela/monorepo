import styled, { css } from "styled-components";
import { PageTitle } from "~ui/typo";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { Button } from "~ui/buttons/Button";
import { useBoolean } from "~shared/hooks/useBoolean";
import { CloseTopicModal } from "./CloseTopicModal";
import { useTopic } from "~frontend/topics/useTopic";
import { AnimatePresence } from "framer-motion";
import { ManageTopic } from "~frontend/views/RoomView/TopicsList/ManageTopic";

interface Props {
  topic?: TopicDetailedInfoFragment | null;
  className?: string;
}

export const TopicHeader = styled(function TopicHeader({ topic, className }: Props) {
  const [isClosingTopic, { unset: closeClosingModal, set: openClosingTopicModal }] = useBoolean(false);

  const { isClosed, isParentRoomOpen, loading, open: openTopic, close: closeTopic } = useTopic(topic);

  if (!topic) {
    return <UIHolder className={className}></UIHolder>;
  }

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
            <UIToggleCloseButton onClick={openTopic} isLoading={loading}>
              Reopen Topic
            </UIToggleCloseButton>
          )}
          {!isClosed && <UIToggleCloseButton onClick={openClosingTopicModal}>Close Topic</UIToggleCloseButton>}
          <ManageTopic topic={topic} />
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

const UIHolder = styled.div`
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: center;
`;

const UITitle = styled(PageTitle)<{ isClosed: boolean }>`
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

const UIActions = styled.div`
  display: flex;
  right: 0;
  position: absolute;
  align-items: center;
`;

const UIToggleCloseButton = styled(Button)`
  margin-right: 16px;
`;
