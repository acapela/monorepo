import styled from "styled-components";
import { TextTitle } from "~ui/typo";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { Button } from "~ui/buttons/Button";

import { useBoolean } from "~frontend/hooks/useBoolean";
import { CloseTopicModal } from "./CloseTopicModal";
import { useTopic } from "~frontend/topics/useTopic";

interface Props {
  topic?: TopicDetailedInfoFragment | null;
  className?: string;
}

export const TopicHeader = styled(function TopicHeader({ topic, className }: Props) {
  const [isClosingTopic, { toggle: toggleClosingTopicModal }] = useBoolean(false);

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
          {!isClosed && <Button onClick={toggleClosingTopicModal}>Close Topic</Button>}
        </UIAction>
      </UIHolder>
      {isClosingTopic && (
        <CloseTopicModal
          topicId={topic.id}
          loading={loading}
          onDismissRequested={() => toggleClosingTopicModal()}
          onTopicClosed={(topicSummary) => closeTopic(topicSummary)}
        />
      )}
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
