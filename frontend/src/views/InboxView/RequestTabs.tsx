import { observer } from "mobx-react";
import React, { useMemo, useState } from "react";
import styled, { css } from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { HStack } from "~ui/Stack";
import { theme } from "~ui/theme";

import { RequestItem } from "./RequestItem";

type TabData = { key: string; title: React.ReactNode; topics: TopicEntity[] };

export const RequestTabs = observer(({ values }: { values: [TabData, ...TabData[]] }) => {
  const [selectedKey, setSelectedKey] = useState(values[0].key);
  const selectedTab = useMemo(() => values.find(({ key }) => key === selectedKey) ?? values[0], [values, selectedKey]);
  return (
    <UIHolder>
      <HStack>
        {values.map(({ key, title, topics }) => (
          <UITab key={key} onClick={() => setSelectedKey(key)} $isSelected={selectedTab.key == key}>
            <UIBold>{title}</UIBold>
            {topics.length}
          </UITab>
        ))}
      </HStack>
      <div>
        {selectedTab.topics.length == 0 ? (
          <UIEmptyText>You are all caught up 🎉</UIEmptyText>
        ) : (
          selectedTab.topics.map((topic) => <RequestItem key={topic.id} topic={topic} />)
        )}
      </div>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  ${theme.spacing.actions.asGap};
`;

const UITab = styled.button<{ $isSelected: boolean }>`
  padding: 10px;

  display: flex;
  ${theme.spacing.close.asGap};

  ${theme.typo.content.resetLineHeight};

  background: none;
  cursor: pointer;

  ${(props) =>
    props.$isSelected &&
    css`
      border-radius: 48px;
      ${theme.colors.panels.selectedTab};
    `}
`;

const UIBold = styled.span<{}>`
  ${theme.font.semibold}
`;

const UIEmptyText = styled.div`
  padding: 15px;
`;
