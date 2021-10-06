import styled from "styled-components";

import { routes } from "~frontend/router";
import { TopicViewCard } from "~frontend/ui/topic/TopicViewCard";
import { CreateNewMessageEditor } from "~frontend/views/LegacyDashboardView/TopicWithMessages/CreateNewMessageEditor";
import { ClientSideOnly } from "~ui/ClientSideOnly";

export function NewTopicCreation() {
  return (
    <TopicViewCard>
      <ClientSideOnly>
        <UIMessageComposer>
          <CreateNewMessageEditor
            requireMention
            onMessageSent={(message) => {
              routes.legacyTopic.push({ topicId: message.topic_id });
            }}
          />
        </UIMessageComposer>
      </ClientSideOnly>
    </TopicViewCard>
  );
}

const UIMessageComposer = styled.div<{}>`
  flex: 1;
  padding: 16px 24px;
  display: flex;
  align-items: flex-end;
`;
