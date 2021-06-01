import styled from "styled-components";
import { TextTitle } from "~ui/typo";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { Button } from "~ui/button";

import { useBoolean } from "~frontend/hooks/useBoolean";
import { CloseTopicPopover } from "./CloseTopicPopover";
import { useRef } from "react";
import { useReopenTopicMutation } from "~frontend/gql/topics";

interface Props {
  topic?: TopicDetailedInfoFragment | null;
  className?: string;
}

export const TopicHeader = styled(function TopicHeader({ topic, className }: Props) {
  const closeTopicRef = useRef<HTMLButtonElement>(null);
  const [isClosingTopic, { unset: dismissClosingTopicModal, toggle: toggleClosingTopicModal }] = useBoolean(false);

  const [reopenTopic, { loading: isReopeningTopic }] = useReopenTopicMutation();

  function handleReopenTopicClick() {
    reopenTopic({ topicId: topic?.id });
  }

  const isClosed = !topic?.closed_at;

  if (!topic) {
    return <UIHolder className={className}></UIHolder>;
  }

  return (
    <>
      <UIHolder className={className}>
        <UITitle>{topic.name}</UITitle>

        <UIAction>
          {isClosed ? (
            <Button ref={closeTopicRef} onClick={() => toggleClosingTopicModal()}>
              Close Topic
            </Button>
          ) : (
            <Button onClick={() => handleReopenTopicClick()} isLoading={isReopeningTopic}>
              Reopen Topic
            </Button>
          )}
        </UIAction>
      </UIHolder>
      {isClosingTopic && (
        <CloseTopicPopover
          anchorRef={closeTopicRef}
          topicId={topic.id}
          onDismissRequested={() => dismissClosingTopicModal()}
          onTopicClosed={() => dismissClosingTopicModal()}
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
