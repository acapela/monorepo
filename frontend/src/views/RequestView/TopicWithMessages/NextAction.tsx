import { formatRelative } from "date-fns";
import { sortBy } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { TaskEntity } from "~frontend/clientdb/task";
import { TopicEntity } from "~frontend/clientdb/topic";
import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { REQUEST_ACTION, REQUEST_READ, REQUEST_RESPONSE, RequestType } from "~shared/types/mention";
import { TextButton } from "~ui/buttons/TextButton";
import { IconAcapelaWave } from "~ui/icons";
import { CircleLabel } from "~ui/icons/CircleLabel";
import { theme } from "~ui/theme";

const NextActionMessage = ({ children }: { children: React.ReactNode | React.ReactNodeArray }) => (
  <UIHolder>
    <UIAcapelaLogo label={<IconAcapelaWave />} />
    <UIText>{children}</UIText>
  </UIHolder>
);

const REQUEST_TYPE_PRIORITIES: RequestType[] = [REQUEST_ACTION, REQUEST_RESPONSE, REQUEST_READ];

/**
 * Shows the most urgent task requested from the current user. Urgency is determined based on due date and request type.
 * Examples:
 * "Please respond to @Gregor's message"
 * "Please take action on @Omar's message before today 9PM"
 */
const NextActionTask = observer(({ tasks }: { tasks: TaskEntity[] }) => {
  const [nextTask] = sortBy(tasks, (task) => [
    task.due_at ?? "z", // ISO8601 dates are lexicographically sortable, but null values should be at the end
    REQUEST_TYPE_PRIORITIES.indexOf(task.type as never),
  ]);
  const dueDate = nextTask.due_at && new Date(nextTask.due_at);
  const now = new Date();
  return (
    <NextActionMessage>
      Please{" "}
      {
        { [REQUEST_ACTION]: "take action on", [REQUEST_RESPONSE]: "respond to", [REQUEST_READ]: "read" }[
          nextTask.type as never
        ]
      }
      &nbsp;
      <UIUserName>@{nextTask.message?.user.name}</UIUserName>'s message
      {dueDate &&
        (dueDate > now ? " before " + formatRelative(dueDate, now) : ` (due ${formatRelative(dueDate, now)})`)}
    </NextActionMessage>
  );
});

const TextAction = (props: Omit<React.ComponentProps<typeof TextButton>, "kind" | "inline">) => (
  <TextButton {...props} kind="primary" inline />
);

const NextActionOwner = observer(({ topic }: { topic: TopicEntity }) => {
  const topicContext = useTopicStoreContext();

  const closeTopic = ({ isArchived: isAlsoArchiving } = { isArchived: false }) => {
    topic.close();

    if (isAlsoArchiving) {
      topic.update({ archived_at: new Date().toISOString() });
      trackEvent("Archived Topic", { topicId: topic.id });
    }
  };

  return (
    <NextActionMessage>
      Please{" "}
      <TextAction onClick={() => topicContext?.editorRef?.current?.chain().focus("end").run()}>
        further the conversation
      </TextAction>
      , <TextAction onClick={() => closeTopic()}>close</TextAction> or{" "}
      <TextAction onClick={() => closeTopic({ isArchived: true })}>close & archive</TextAction> the topic
    </NextActionMessage>
  );
});

export const NextAction = observer(({ topic }: { topic: TopicEntity }) => {
  const openTasks = topic.tasks.query({ isDone: false });

  const openTasksAssignedToSelf = openTasks.query({ isAssignedToSelf: true }).all;
  if (openTasksAssignedToSelf.length > 0) {
    return <NextActionTask tasks={openTasksAssignedToSelf} />;
  }

  if (!openTasks.hasItems && topic.isOwn) {
    return <NextActionOwner topic={topic} />;
  }

  return null;
});

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  padding: 20px 0;
  ${theme.spacing.actions.asGap}
`;

const UIAcapelaLogo = styled(CircleLabel)<{}>`
  font-size: 20px;
`;

const UIText = styled.div<{}>`
  ${theme.typo.content};
`;

const UIUserName = styled.span<{}>`
  ${theme.typo.content.medium};
`;
