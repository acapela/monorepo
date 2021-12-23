import { action } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { PageLayoutAnimator, layoutAnimations } from "~frontend/animations/layout";
import { useAppStateStore } from "~frontend/appState/AppStateStore";
import { TopicEntity } from "~frontend/clientdb/topic";
import { PriorityIcon } from "~frontend/topics/priority";
import { PriorityPicker } from "~frontend/topics/PriorityPicker";
import { HorizontalSpacingContainer } from "~frontend/ui/layout";
import { OptionsButton } from "~frontend/ui/options/OptionsButton";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { openUIPrompt } from "~frontend/utils/prompt";
import { getLabelForPriority } from "~shared/priorities";
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
  const appState = useAppStateStore();
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
    appState.creatingNewTopic = { enabled: true, duplicateFromTopicId: topic.id };
  });

  const handleTopicArchive = action(async () => {
    topic.archive();
  });

  return (
    <UIHolder>
      <div>
        <UITitle
          data-test-id="topic-title"
          data-tooltip="Rename..."
          layoutId={layoutAnimations.newTopic.title(topic.id)}
          onClick={handleTopicRename}
        >
          {topic.name}
        </UITitle>
        <PriorityPicker priority={topic.priority ?? null} onChange={(priority) => topic.update({ priority })}>
          <UIPriority data-tooltip="Change priority...">
            <UIPriorityIcon priority={topic.priority ?? null} />
            {topic.priority ? (
              <>
                <UIPriorityTitle>Priority</UIPriorityTitle> {getLabelForPriority(topic.priority)}
              </>
            ) : (
              "No priority"
            )}
          </UIPriority>
        </PriorityPicker>
      </div>

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
              onSelect: () => (topic.isArchived ? handleReopenTopic() : handleTopicArchive()),
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
  margin-bottom: 5px;
  ${theme.typo.pageTitle};
  cursor: pointer;
`;

const UIPriority = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${theme.typo.content};
  cursor: pointer;
`;

const UIPriorityTitle = styled.div`
  margin-right: 5px;
  ${theme.typo.content.semibold};
`;

const UIPriorityIcon = styled(PriorityIcon)`
  margin-right: 10px;
`;

const UITopicTools = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.actions.asGap}
  ${theme.typo.pageTitle};
`;
