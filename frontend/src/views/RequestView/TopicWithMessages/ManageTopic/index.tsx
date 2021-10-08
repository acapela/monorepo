import { observer } from "mobx-react";
import React, { useCallback } from "react";

import { trackEvent } from "~frontend/analytics/tracking";
import { TopicEntity } from "~frontend/clientdb/topic";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { openUIPrompt } from "~frontend/utils/prompt";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { IconArchive, IconEdit, IconTrash } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

interface Props {
  topic: TopicEntity;
  onRenameRequest?: () => void;
}

export const ManageTopic = observer(({ topic, onRenameRequest }: Props) => {
  const handleArchiveTopic = async () => {
    topic.update({ id: topic.id, archived_at: new Date().toISOString() });
  };

  const handleDeleteSelect = useCallback(async () => {
    const isDeleteConfirmed = await openConfirmPrompt({
      title: "Please confirm",
      description: `Are you sure you want to permanently delete "${topic.name}"?`,
      confirmLabel: "Delete",
    });
    if (isDeleteConfirmed) {
      topic.remove();
      trackEvent("Deleted Topic", { topicId: topic.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic.name]);

  const handleRenameWithModal = useCallback(async () => {
    const name = await openUIPrompt({
      initialValue: topic.name || "",
      title: "Rename topic",
      submitLabel: "Rename",
      placeholder: "Enter topic name",
      validateInput: createLengthValidator("Topic name", 3),
    });

    if (!name?.trim()) {
      return;
    }
    topic.update({ name });
    trackEvent("Renamed Topic", { topicId: topic.id, newTopicName: name, oldTopicName: topic.name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic.name]);

  const isTopicManager = topic.isOwn;

  const options = [];
  if (isTopicManager) {
    options.push({
      label: "Rename topic",
      onSelect: onRenameRequest ?? handleRenameWithModal,
      icon: <IconEdit />,
    });

    if (topic.closed_at && !topic.archived_at) {
      options.push({
        label: "Archive topic",
        onSelect: handleArchiveTopic,
        icon: <IconArchive />,
      });
    }

    options.push({
      label: "Delete topic",
      isDestructive: true,
      onSelect: handleDeleteSelect,
      icon: <IconTrash />,
    });
  }

  if (options.length < 1) return null;

  return (
    <>
      <PopoverMenuTrigger placement="bottom-start" options={options}>
        <CircleOptionsButton />
      </PopoverMenuTrigger>
    </>
  );
});
