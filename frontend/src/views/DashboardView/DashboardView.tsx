import styled from "styled-components";

import { DashboardNavigation } from "./Navigation/DashboardNavigation";
import { OpenedTopic } from "./OpenedTopic";

interface Props {
  topicId?: string;
}

export function DashboardView({ topicId }: Props) {
  return (
    <UIHolder>
      <UINavigationHolder>
        <DashboardNavigation />
      </UINavigationHolder>
      <UIActiveContentHolder>{topicId && <OpenedTopic key={topicId} topicId={topicId} />}</UIActiveContentHolder>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  grid-gap: 24px;
  flex-grow: 1;
`;

const UINavigationHolder = styled.div`
  padding: 20px;
`;

const UIActiveContentHolder = styled.div``;
