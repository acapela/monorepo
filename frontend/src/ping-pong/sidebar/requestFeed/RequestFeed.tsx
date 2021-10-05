import { observer } from "mobx-react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { theme } from "~ui/theme";

import { RequestItem } from "./RequestItem";

interface Props {
  selectedItemId?: string;
}

export const RequestFeed = observer(({ selectedItemId }: Props) => {
  const db = useDb();
  const topics = db.topic.find((topic) => topic.closedByUser === null).all;

  return (
    <UIHolder>
      <UISection key="Open">
        <UISectionTitle>Open</UISectionTitle>
        {topics.map((topic) => (
          <RequestItem isHighlighted={selectedItemId === topic.id} key={topic.id} topicId={topic.id} />
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
  gap: 8px;
`;

const UISectionTitle = styled.div<{}>`
  padding-left: 10px;
  ${theme.font.withExceptionalSize("11px", "New sizing").build()}
  opacity: 0.6;
`;
