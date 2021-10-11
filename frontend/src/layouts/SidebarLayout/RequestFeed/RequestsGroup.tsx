import { observer } from "mobx-react";
import styled from "styled-components";

import { groupByFilter } from "~frontend/../../shared/groupByFilter";
import { useDb } from "~frontend/clientdb";
import { TopicEntity } from "~frontend/clientdb/topic";
import { theme } from "~ui/theme";

import { RequestItem } from "./RequestItem";

interface Props {
  topics: TopicEntity[];
  groupName: string;
}

export const RequestsGroup = observer(({ topics, groupName }: Props) => {
  return (
    <UIHolder>
      <UISection>
        <UISectionTitle>{groupName}</UISectionTitle>
        {topics.map((topic) => (
          <RequestItem isHighlighted={false} key={topic.id} topic={topic} />
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
  ${theme.font.withExceptionalSize("11px", "New sizing").build()}
  opacity: 0.6;
`;
