import { runInAction } from "mobx";
import { observer } from "mobx-react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { TaskEntity } from "~frontend/clientdb/task";
import { getMentionColor } from "~frontend/message/extensions/mentions/TypedMention";
import {
  COMPLETED_REQUEST_LABEL,
  MentionType,
  REQUEST_DECISION,
  RequestType,
  UNCOMPLETED_REQUEST_LABEL,
} from "~shared/types/mention";
import { Button, baseButtonStyles } from "~ui/buttons/Button";
import { IconCheck, IconCheckboxCircle, IconChevronDown, IconUndo } from "~ui/icons";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { theme } from "~ui/theme";

interface Props {
  task: TaskEntity;
}

export const OwnTaskCompletionButton = observer(function OwnTaskCompletionButton({ task }: Props) {
  if (task.type === REQUEST_DECISION) {
    return <DecisionCompletionButton task={task} />;
  }

  if (!task.isDone) {
    return (
      <TaskColoredButton
        $taskType={task.type as MentionType}
        onClick={() => {
          task.update({ done_at: new Date().toISOString() });
        }}
      >
        {UNCOMPLETED_REQUEST_LABEL[task.type as RequestType]}
      </TaskColoredButton>
    );
  }

  return (
    <PopoverMenuTrigger
      options={[
        {
          key: "undo",
          label: "Undo",
          onSelect: () => {
            task.update({ done_at: null });
          },
          icon: <IconUndo />,
        },
      ]}
    >
      <Button key="done" kind="secondary" size="compact" icon={<IconCheckboxCircle />} indicateDropdown>
        {COMPLETED_REQUEST_LABEL[task.type as RequestType]}
      </Button>
    </PopoverMenuTrigger>
  );
});

const TaskColoredButton = styled.div<{ $taskType: MentionType }>`
  ${baseButtonStyles};
  ${theme.box.compactButton};
  ${(props) => getMentionColor(props.$taskType).interactive};
`;

// TODO: Very meh, clean up later!
export const DecisionCompletionButton = observer(function DecisionCompletionButton({ task }: Props) {
  const db = useDb();
  const currentUser = useAssertCurrentUser();

  const decisionOptions = db.decisionOption.query({ message_id: task.message_id }).all;

  const allMessageVotes = decisionOptions.flatMap((option) => option.votes.all);

  const currentUserVote = allMessageVotes.find((vote) => vote.user_id === currentUser.id);

  const decisionMenuOptions: PopoverMenuOption[] = decisionOptions.map((option) => ({
    key: option.id,

    label: option.option,

    onSelect: () => {
      if (currentUserVote && currentUserVote.decision_option_id !== option.id) {
        currentUserVote.remove();
      }
      runInAction(() => {
        db.decisionVote.create({ decision_option_id: option.id, user_id: currentUser.id });
        task.update({ done_at: new Date().toISOString() });
      });
    },

    icon: currentUserVote?.decision_option_id === option.id ? <IconCheck /> : null,
  }));

  if (!task.isDone) {
    return (
      <PopoverMenuTrigger options={decisionMenuOptions}>
        {/* TODO: Use button instead */}
        <TaskColoredButton key="done" $taskType={task.type as MentionType}>
          {UNCOMPLETED_REQUEST_LABEL[task.type as RequestType]}{" "}
          <UIIconHolder>
            <IconChevronDown />
          </UIIconHolder>
        </TaskColoredButton>
      </PopoverMenuTrigger>
    );
  }

  return (
    <PopoverMenuTrigger
      options={[
        {
          key: "undo",
          label: "Undo",
          onSelect: () => {
            runInAction(() => {
              currentUserVote?.remove();
              task.update({ done_at: null });
            });
          },
          icon: <IconUndo />,
        },
      ]}
    >
      <Button key="done" kind="secondary" size="compact" icon={<IconCheckboxCircle />} indicateDropdown>
        {COMPLETED_REQUEST_LABEL[task.type as RequestType]}
      </Button>
    </PopoverMenuTrigger>
  );
});

const ICON_SIZE_TO_TEXT_RATIO = 1.5;

const UIIconHolder = styled.div<{}>`
  font-size: ${ICON_SIZE_TO_TEXT_RATIO}em;
  height: ${1 / ICON_SIZE_TO_TEXT_RATIO}em;
  display: flex;
  align-items: center;
`;
