import styled from "styled-components";

import { DashboardNavigation } from "./Navigation/DashboardNavigation";
import { NewTopicCreation } from "./NewTopicCreation";
import { OpenedTopic } from "./OpenedTopic";

interface Props {
  topicId?: string;
}

export function LegacyDashboardView({ topicId }: Props) {
  return (
    <UIHolder>
      <UINavigationHolder>
        <DashboardNavigation />
      </UINavigationHolder>
      <UIActiveContentHolder>
        {topicId && <OpenedTopic key={topicId} topicId={topicId} />}
        {!topicId && <NewTopicCreation />}
      </UIActiveContentHolder>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  grid-gap: 24px;
  flex-grow: 1;
  overflow-y: hidden;
`;

const UINavigationHolder = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`;

const UIActiveContentHolder = styled.div`
  overflow-y: auto;
`;
