import { orderBy, partition } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { TopicEntity } from "~frontend/clientdb/topic";
import { pluralize } from "~shared/text/pluralize";
import { theme } from "~ui/theme";

import { highlighters } from "./highlighers";
import { RequestTabs } from "./RequestTabs";

const RequestsStream = observer(({ topics }: { topics: TopicEntity[] }) => {
  if (topics.length == 0) {
    return null;
  }
  const [assignedTopics, stillOpenTopics] = partition(
    orderBy(topics, (topic) => highlighters.map(({ check }) => !check(topic))),
    (topic) => topic.selfAssignedOpenTasks.count > 0
  );
  return (
    <RequestTabs
      values={[
        { key: "received", title: "For you", topics: assignedTopics },
        { key: "open", title: "Still open", topics: stillOpenTopics },
      ]}
    />
  );
});

export const InboxView = observer(() => {
  const db = useDb();
  const openTopics = db.topic.query({ isArchived: false, isClosed: false });
  const unreadTasksCount = openTopics.query(
    (topic) => topic.selfAssignedOpenTasks.query({ seen_at: null }).hasItems
  ).count;
  return (
    <UILayout>
      <div>
        <UITitle>Inbox</UITitle>
        <UIWelcome>
          Hi there 👋
          {unreadTasksCount > 0 && (
            <>
              {" "}
              You have <UIUnreadIndicator>{unreadTasksCount} new unread</UIUnreadIndicator>{" "}
              {pluralize(unreadTasksCount, "request", "requests")}.
            </>
          )}
        </UIWelcome>
      </div>
      <RequestsStream topics={openTopics.all} />
    </UILayout>
  );
});

const UILayout = styled.div`
  padding: 50px;
  max-width: 900px;

  display: flex;
  flex-direction: column;
  ${theme.spacing.pageSections.asGap};

  @media (min-width: 800px) {
    padding-left: 120px;
  }
`;

const UITitle = styled.h1`
  ${theme.typo.pageTitle};
  margin-bottom: 10px;
`;

const UIWelcome = styled.div`
  ${theme.typo.content};
`;

const UIUnreadIndicator = styled.span`
  ${theme.typo.content.semibold};
`;
