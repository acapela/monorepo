import { addBusinessDays, differenceInHours, formatRelative } from "date-fns";
import { sortBy } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { TopicEntity } from "~frontend/clientdb/topic";
import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { relativeFormatDate } from "~shared/dates/format";
import { REQUEST_ACTION, REQUEST_READ, REQUEST_RESPONSE, RequestType } from "~shared/types/mention";
import { TextButton } from "~ui/buttons/TextButton";
import { theme } from "~ui/theme";

import { TopicEventTemplate } from "./TopicEventTemplate";

const REQUEST_TYPE_PRIORITIES: RequestType[] = [REQUEST_ACTION, REQUEST_RESPONSE, REQUEST_READ];

/**
 * Shows the most urgent task requested from the current user. Urgency is determined based on due date and request type.
 * Examples:
 * "Please respond to @Gregor's message"
 * "Please take action on @Omar's message before today 9PM"
 */
const NextActionOpenTaskUser = observer(({ tasks }: { tasks: TaskEntity[] }) => {
  const [nextTask] = sortBy(tasks, (task) => [
    task.dueDate ?? "z", // ISO8601 dates are lexicographically sortable, but null values should be at the end
    REQUEST_TYPE_PRIORITIES.indexOf(task.type as never),
  ]);
  const dueDate = nextTask.dueDate;
  const now = new Date();
  return (
    <TopicEventTemplate>
      Please{" "}
      {
        { [REQUEST_ACTION]: "complete", [REQUEST_RESPONSE]: "respond to", [REQUEST_READ]: "read and confirm" }[
          nextTask.type as never
        ]
      }
      &nbsp;
      <UIUserName>@{nextTask.message?.user.name}</UIUserName>'s task
      {dueDate &&
        (dueDate > now ? " before " + formatRelative(dueDate, now) : ` (due ${formatRelative(dueDate, now)})`)}
    </TopicEventTemplate>
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
    }
  };

  return (
    <TopicEventTemplate>
      Please{" "}
      <TextAction onClick={() => topicContext?.editorRef?.current?.chain().focus("end").run()}>
        continue the conversation
      </TextAction>
      , <TextAction onClick={() => closeTopic()}>close</TextAction> or{" "}
      <TextAction onClick={() => closeTopic({ isArchived: true })}>close & archive</TextAction> the topic
    </TopicEventTemplate>
  );
});

const NextActionArchivePrompt = observer(({ topic }: { topic: TopicEntity }) => {
  function handleReopen() {
    topic.update({ closed_at: null, closed_by_user_id: null });
  }

  function handleArchive() {
    topic.update({ archived_at: new Date().toISOString() });
  }

  function getTimeOfArchiveLabel() {
    const now = new Date();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const closedDate = new Date(topic.closed_at!);
    const timeOfArchive = addBusinessDays(closedDate, 1);

    const hoursUntilArchive = differenceInHours(timeOfArchive, now);

    // If an old topic has been un-archived or approaching hour of archive
    if (hoursUntilArchive <= 1) {
      return "soon";
    }

    return relativeFormatDate(timeOfArchive);
  }

  return (
    <TopicEventTemplate>
      <UIBold>{topic.name}</UIBold> will be{" "}
      <UIArchiveTooltip data-tooltip="Archived requests are available through the search bar">
        archived
      </UIArchiveTooltip>{" "}
      automatically {getTimeOfArchiveLabel()}. <br /> You could also{" "}
      <TextAction onClick={handleReopen}>Reopen</TextAction> or{" "}
      <TextAction onClick={handleArchive}>Archive now</TextAction>.
    </TopicEventTemplate>
  );
});

export const NextAction = observer(({ topic }: { topic: TopicEntity }) => {
  const openTasks = topic.tasks.query({ isDone: false });

  if (topic.isArchived) {
    return null;
  }

  if (topic.isClosed && !topic.isArchived) {
    return <NextActionArchivePrompt topic={topic} />;
  }
  const openTasksAssignedToSelf = openTasks.query({ isAssignedToSelf: true }).all;
  if (openTasksAssignedToSelf.length > 0) {
    return <NextActionOpenTaskUser tasks={openTasksAssignedToSelf} />;
  }

  if (!openTasks.hasItems && !topic.isClosed && topic.isOwn) {
    return <NextActionOwner topic={topic} />;
  }

  return null;
});

const UIUserName = styled.span<{}>`
  ${theme.typo.content.medium};
`;

const UIBold = styled.span<{}>`
  ${theme.font.semibold}
`;

const UIArchiveTooltip = styled.span<{}>`
  text-decoration: underline;
  cursor: default;
`;
