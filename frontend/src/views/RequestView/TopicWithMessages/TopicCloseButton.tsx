import { observer } from "mobx-react";

import { cachedComputed } from "@aca/clientdb";
import { TopicEntity } from "@aca/frontend/clientdb/topic";
import { openConfirmPrompt } from "@aca/frontend/utils/confirm";
import { Button } from "@aca/ui/buttons/Button";
import { IconCheck, IconLock, IconUndo } from "@aca/ui/icons";

interface Props {
  topic: TopicEntity;
}

const hasTopicOpenTasks = cachedComputed((topic: TopicEntity) => {
  return topic.tasks.query({ isDone: false });
});

export const TopicCloseButton = observer(function TopicCloseButton({ topic }: Props) {
  const openTasks = hasTopicOpenTasks(topic);
  const hasOpenTasks = openTasks.hasItems;

  const tasksPluralLabel = openTasks.count === 1 ? "task" : "tasks";

  function getTooltip() {
    if (hasOpenTasks) {
      return `Close with ${openTasks.count} pending ${tasksPluralLabel}`;
    }
  }

  async function handleClose() {
    if (!hasOpenTasks) {
      topic.close();
      return;
    }

    const didConfirm = await openConfirmPrompt({
      title: `Close request with pending tasks`,
      description: `This request still has ${openTasks.count} pending ${tasksPluralLabel}. Are you sure you want to close it anyway?`,
      confirmLabel: `Close request`,
    });

    if (!didConfirm) return;

    topic.close();
  }

  if (topic.isArchived) {
    return (
      <Button
        key="unarchive"
        icon={<IconUndo />}
        onClick={() => {
          topic.open();
        }}
        kind="secondary"
        size="compact"
      >
        Reopen
      </Button>
    );
  }

  if (topic.isClosed) {
    return (
      <>
        <Button
          key="reopen"
          icon={<IconUndo />}
          onClick={() => {
            topic.open();
          }}
          kind="secondary"
          size="compact"
        >
          Reopen
        </Button>
        <Button
          key="archive"
          icon={<IconLock />}
          onClick={() => {
            topic.archive();
          }}
          kind="primary"
          size="compact"
        >
          Archive
        </Button>
      </>
    );
  }

  return (
    <Button
      key="close"
      icon={<IconCheck />}
      tooltip={getTooltip()}
      onClick={handleClose}
      kind={hasOpenTasks ? "secondary" : "primary"}
      size="compact"
    >
      Close Request
    </Button>
  );
});
