import { observer } from "mobx-react";
import styled from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { theme } from "~ui/theme";

import { RequestItem } from "./RequestItem";

export interface RequestsGroupProps {
  topics: TopicEntity[];
  groupName: string;
}

export const RequestsGroup = observer(({ topics, groupName }: RequestsGroupProps) => {
  return (
    <UIHolder data-test-id={`sidebar-request-group-${groupName.toLowerCase().split(" ").join("-").trim()}`}>
      <UISection>
        <UISectionTitle>{groupName}</UISectionTitle>
        {topics.map((topic) => (
          <RequestItem key={topic.id} topic={topic} />
        ))}
      </UISection>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  overflow-x: hidden;
`;

const UISection = styled.div<{}>`
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 2px;
`;

const UISectionTitle = styled.div<{}>`
  padding-left: 10px;
  ${theme.typo.item.secondaryTitle}
  opacity: 0.6;
`;
