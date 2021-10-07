import { pick } from "lodash";
import React, { useCallback, useMemo } from "react";

import { MessageEntity } from "~frontend/clientdb/message";
import { TaskEntity } from "~frontend/clientdb/task";
import { useLocalStorageState } from "~frontend/hooks/useLocalStorageState";
import { getNodesFromContentByType } from "~richEditor/content/helper";
import { RichEditorNode } from "~richEditor/content/types";
import { getEmptyRichContent } from "~richEditor/RichEditor";
import { insertAtIndexIntoArray } from "~shared/array";
import { MentionType } from "~shared/types/mention";
import { getUUID } from "~shared/uuid";

type MentionTaskData = { id: string; userId: string; type: MentionType };

const createTaskDraft = (userId: string, type: MentionType): MentionTaskData => ({
  id: getUUID(),
  type,
  userId,
});

type MentionTaskDrafts = {
  createOrUpdateTaskDraft?: typeof createTaskDraft;
  tasks: MentionTaskData[];
};

export const MentionTaskDraftsContext = React.createContext<MentionTaskDrafts>({
  createOrUpdateTaskDraft: createTaskDraft,
  tasks: [],
});

const EMPTY_CONTENT = getEmptyRichContent();

export const taskToMentionTaskData = (task: TaskEntity) =>
  ({ ...pick(task, "id", "type"), userId: task.user_id } as MentionTaskData);

export const getTaskIdsFromContentMentions = (content: RichEditorNode) =>
  new Set(getNodesFromContentByType(content, "mention").map((node) => node.attrs?.data.taskId));

export function useStoredContentAndTasks(messageOrTopicId: MessageEntity | string) {
  const message = typeof messageOrTopicId == "string" ? null : messageOrTopicId;

  const [{ content, taskDrafts }, setContentAndTasks] = useLocalStorageState<{
    content: RichEditorNode;
    taskDrafts: MentionTaskData[];
  }>({
    key: "message-and-tasks-draft-for-" + (message ? "message:" + message.id : "topic:" + messageOrTopicId),
    initialValue: { content: message?.content || EMPTY_CONTENT, taskDrafts: [] },
  });

  const setContentAndUpdateTasks = useCallback(
    (content: RichEditorNode) => {
      const mentionedTaskIds = getTaskIdsFromContentMentions(content);
      setContentAndTasks(({ taskDrafts }) => ({
        content,
        taskDrafts: taskDrafts.filter((task) => mentionedTaskIds.has(task.id)),
      }));
    },
    [setContentAndTasks]
  );

  const setTaskDrafts = useCallback(
    (tasks: MentionTaskData[]) => {
      setContentAndTasks(({ content }) => ({ content, taskDrafts: tasks }));
    },
    [setContentAndTasks]
  );

  const mentionTasksContextValue: MentionTaskDrafts = useMemo(
    () => ({
      createOrUpdateTaskDraft(userId, type) {
        // First we try to reuse a task already attached to the existing message
        const task = message?.tasks.all.find((task) => task.user_id === userId && task.type === type);
        if (task) {
          return taskToMentionTaskData(task);
        }

        let index = taskDrafts.findIndex((task) => task.userId == userId);
        let taskDraft: MentionTaskData;
        if (index === -1) {
          index = taskDrafts.length;
          taskDraft = createTaskDraft(userId, type);
        } else {
          taskDraft = { ...taskDrafts[index], type };
        }
        setTaskDrafts(insertAtIndexIntoArray(taskDrafts, taskDraft, index));
        return taskDraft;
      },
      tasks: message
        ? taskDrafts.concat(
            message.tasks.all
              .filter((task) => !taskDrafts.some((draft) => draft.userId == task.user_id))
              .map(taskToMentionTaskData)
          )
        : taskDrafts,
    }),
    [message, setTaskDrafts, taskDrafts]
  );

  return { content, taskDrafts, setContentAndUpdateTasks, mentionTasksContextValue };
}
