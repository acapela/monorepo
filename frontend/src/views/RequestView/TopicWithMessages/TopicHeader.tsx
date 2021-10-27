import { action } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { PageLayoutAnimator, layoutAnimations } from "~frontend/animations/layout";
import { TopicEntity } from "~frontend/clientdb/topic";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { openUIPrompt } from "~frontend/utils/prompt";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { IconButton } from "~ui/buttons/IconButton";
import { IconCheck, IconEdit, IconLock, IconMoreHoriz, IconUndo, IconUnlock } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { theme } from "~ui/theme";

import { MESSAGES_VIEW_MAX_WIDTH_PX } from "./ui";

interface Props {
  topic: TopicEntity;
}

export const TopicHeader = observer(function TopicHeader({ topic }: Props) {
  function handleCloseTopic() {
    topic.close();
    trackEvent("Closed Topic", { topicId: topic.id });
  }

  const handleReopenTopic = action(() => {
    topic.open();
    trackEvent("Reopened Topic", { topicId: topic.id });
  });

  const handleTopicRename = action(async () => {
    const name = await openUIPrompt({
      title: "Rename",
      initialValue: topic.name,
      validateInput: createLengthValidator("Topic name", 3),
    });

    topic.update({ name: name ?? undefined });
    trackEvent("Renamed Topic", { topicId: topic.id });
  });

  const handleTopicArchive = action(async () => {
    if (!topic.isClosed) {
      handleCloseTopic();
    }
    topic.update({ archived_at: new Date().toISOString() });
    trackEvent("Archived Topic", { topicId: topic.id });
  });

  const handleTopicUnarchive = action(async () => {
    topic.update({ archived_at: null });
    trackEvent("Reopened Topic", { topicId: topic.id });
  });

  return (
    <UIHolder>
      <UITitle layoutId={layoutAnimations.newTopic.title(topic.id)}>{topic.name}</UITitle>
      <UITopicTools>
        <AvatarList users={topic.participants.all} maxVisibleCount={5} />
        {/* TODO: Include invite button */}
        <PopoverMenuTrigger
          options={[
            {
              label: "Rename",
              onSelect: () => handleTopicRename(),
              icon: <IconEdit />,
            },
            {
              label: topic.isClosed ? "Reopen" : "Close",
              onSelect: () => (topic.isClosed ? handleReopenTopic() : handleCloseTopic()),
              icon: topic.isClosed ? <IconUndo /> : <IconCheck />,
            },
            {
              label: topic.isArchived ? "Unarchive" : topic.isClosed ? "Archive" : "Close and Archive",
              onSelect: () => (topic.isArchived ? handleTopicUnarchive() : handleTopicArchive()),
              icon: topic.isArchived ? <IconUnlock /> : <IconLock />,
              isDestructive: true,
            },
          ]}
        >
          <IconButton kind="secondary" icon={<IconMoreHoriz />} />
        </PopoverMenuTrigger>
      </UITopicTools>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
  max-width: ${MESSAGES_VIEW_MAX_WIDTH_PX}px;
`;

const UITitle = styled(PageLayoutAnimator)`
  ${theme.typo.pageTitle};
`;

const UITopicTools = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.horizontalActions.asGap}
  ${theme.typo.pageTitle};
`;
