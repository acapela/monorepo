import styled from "styled-components";
import { TextTitle } from "~ui/typo";
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

  const { isClosed, loading, open: openTopic, close: closeTopic } = useTopic(topic);

  if (!topic) {
    return <UIHolder className={className}></UIHolder>;
  }

  return (
    <>
      <UIHolder className={className}>
        <UITitle>{topic.name}</UITitle>

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
  align-items: center;
  justify-content: space-between;
`;

const UITitle = styled(TextTitle)``;

const UIActions = styled.div`
  display: flex;
  align-items: center;
`;

const UIToggleCloseButton = styled(Button)`
  margin-right: 16px;
`;
