import styled from "styled-components";
import { TextTitle } from "~ui/typo";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { Button } from "~ui/buttons/Button";

import { useBoolean } from "~frontend/hooks/useBoolean";
import { CloseTopicModal } from "./CloseTopicModal";
import { useTopic } from "~frontend/topics/useTopic";
import { AnimatePresence } from "framer-motion";

interface Props {
  topic?: TopicDetailedInfoFragment | null;
  className?: string;
}

export const TopicHeader = styled(function TopicHeader({ topic, className }: Props) {
  const [isClosingTopic, { set: openClosingModal, unset: closeClosingModal }] = useBoolean(false);

  const { isClosed, loading, open: openTopic, close: closeTopic } = useTopic(topic);

  if (!topic) {
    return <UIHolder className={className}></UIHolder>;
  }

  return (
    <>
      <UIHolder className={className}>
        <UITitle>{topic.name}</UITitle>

        <UIAction>
          {isClosed && (
            <Button onClick={openTopic} isLoading={loading}>
              Reopen Topic
            </Button>
          )}
          {!isClosed && <Button onClick={openClosingModal}>Close Topic</Button>}
        </UIAction>
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

const UIAction = styled.div``;
