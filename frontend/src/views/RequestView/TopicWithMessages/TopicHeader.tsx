import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import styled, { css } from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { TopicEntity } from "~frontend/clientdb/topic";
import { useIsCurrentUserTopicManager } from "~frontend/topics/useIsCurrentUserTopicManager";
import { isTopicClosed } from "~frontend/topics/utils";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";
import { TextH3 } from "~ui/typo";

import { CloseTopicModal } from "./CloseTopicModal";
import { ManageTopic } from "./ManageTopic";
import { TopicHeaderDueDate } from "./TopicHeaderDueDate";

interface Props {
  topic: TopicEntity;
  onCloseTopicRequest?: (summary: string) => void;
  className?: string;
}

export const TopicHeader = observer(({ topic, onCloseTopicRequest }: Props) => {
  const [isClosingTopic, { unset: closeClosingModal, set: openClosingTopicModal }] = useBoolean(false);
  const isClosed = Boolean(topic && isTopicClosed(topic));
  const isTopicManager = useIsCurrentUserTopicManager(topic);

  const handleRestoreTopic = () => {
    topic.update({ closed_at: null, closed_by_user_id: null, archived_at: null });
    trackEvent("Reopened Topic");
  };

  const handleReopenTopic = () => {
    topic.update({ closed_at: null, closed_by_user_id: null });
    trackEvent("Reopened Topic");
  };

  return (
    <UIHolder>
      <UITopicMeta>
        <UITitle isClosed={isClosed}>{topic.name}</UITitle>
        <TopicHeaderDueDate topic={topic} />
      </UITopicMeta>

      <UIActions>
        {isClosed &&
          (topic.archived_at ? (
            <UIToggleCloseButton
              onClick={handleRestoreTopic}
              isDisabled={!isTopicManager && { reason: `You have to be the topic owner to restore topics` }}
            >
              Restore Topic
            </UIToggleCloseButton>
          ) : (
            <UIToggleCloseButton
              onClick={handleReopenTopic}
              isDisabled={!isTopicManager && { reason: `You have to be the topic owner to reopen topics` }}
            >
              Reopen Topic
            </UIToggleCloseButton>
          ))}
        {onCloseTopicRequest && <UIToggleCloseButton onClick={openClosingTopicModal}>Close Topic</UIToggleCloseButton>}
        <ManageTopic topic={topic} />
      </UIActions>
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
