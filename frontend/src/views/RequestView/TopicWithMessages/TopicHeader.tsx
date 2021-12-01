import { action } from "mobx";
import { observer } from "mobx-react";
import router from "next/router";
import React from "react";
import styled from "styled-components";

import { PageLayoutAnimator, layoutAnimations } from "~frontend/animations/layout";
import { TopicEntity } from "~frontend/clientdb/topic";
import { HorizontalSpacingContainer } from "~frontend/ui/layout";
import { OptionsButton } from "~frontend/ui/options/OptionsButton";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { openUIPrompt } from "~frontend/utils/prompt";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { IconCheck, IconCopy, IconEdit, IconLock, IconUndo, IconUnlock } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { theme } from "~ui/theme";

import { TopicCloseButton } from "./TopicCloseButton";
import { MESSAGES_VIEW_MAX_WIDTH_PX } from "./ui";

interface Props {
  topic: TopicEntity;
}

export const TopicHeader = observer(function TopicHeader({ topic }: Props) {
  function handleCloseTopic() {
    topic.close();
  }

  const handleReopenTopic = action(() => {
    topic.open();
  });

  const handleTopicRename = action(async () => {
    const name = await openUIPrompt({
      title: "Rename topic",
      initialValue: topic.name,
      validateInput: createLengthValidator("Topic name", 3),
    });

    topic.update({ name: name ?? undefined });
  });

  const handleTopicDuplicateRequest = action(async () => {
    router.push(topic.duplicateHref);
  });

  const handleTopicArchive = action(async () => {
    topic.archive();
  });

  const handleTopicUnarchive = action(async () => {
    topic.unarchive();
  });

  return (
    <UIHolder>
      <UITitle
        data-test-id="topic-title"
        data-tooltip="Rename..."
        layoutId={layoutAnimations.newTopic.title(topic.id)}
        onClick={handleTopicRename}
      >
        {topic.name}
      </UITitle>
      <UITopicTools>
        <TopicCloseButton topic={topic} />
        <AvatarList users={topic.members} maxVisibleCount={5} />
        {/* TODO: Include invite button */}
        <PopoverMenuTrigger
          options={[
            {
              label: "Rename",
              onSelect: () => handleTopicRename(),
              icon: <IconEdit />,
            },
            {
              label: "Duplicate",
              onSelect: () => handleTopicDuplicateRequest(),
              icon: <IconCopy />,
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
          <OptionsButton data-test-id="topic-options" kind="secondary" />
        </PopoverMenuTrigger>
      </UITopicTools>
    </UIHolder>
  );
});

const UIHolder = styled(HorizontalSpacingContainer)`
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
  cursor: pointer;
`;

const UITopicTools = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.actions.asGap}
  ${theme.typo.pageTitle};
`;
