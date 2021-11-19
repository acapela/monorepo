import { AnimatePresence, motion } from "framer-motion";
import { computed } from "mobx";
import { observer } from "mobx-react";
import React, { useMemo, useRef } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import styled, { css } from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useBoundingBox } from "~shared/hooks/useBoundingBox";
import { IconChevronDown } from "~ui/icons";
import { theme } from "~ui/theme";

import { RequestsGroupProps } from "../RequestsGroup";
import { prepareTopicsGroups } from "./prepareTopicsGroups";
import { RequestItem } from "./RequestItem";
import { useArchivedGroups } from "./useArchivedGroups";

interface Props {
  topics: TopicEntity[];
  showArchived?: boolean;
}

const ANIMATION_DURATION = 0.55;

type HeaderRow = {
  type: "header";
  key: string;
  label: string;
};

type TopicRow = {
  type: "topic";
  key: string;
  topic: TopicEntity;
};

type VirtualizedRow = HeaderRow | TopicRow;

function convertGroupsToVirtualizedRows(groups: RequestsGroupProps[]): VirtualizedRow[] {
  const rows: VirtualizedRow[] = [];

  for (const { groupName, topics } of groups) {
    rows.push({ type: "header", label: groupName, key: groupName });
    for (const topic of topics) {
      rows.push({ type: "topic", topic, key: topic.id });
    }
  }

  return rows;
}

export const RequestFeedGroups = observer(({ topics, showArchived = false }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const boundingBox = useBoundingBox(ref);

  // MBA m1 2021 -> 186 ms to process (archived orderBy is main culprit)
  const { receivedTasks, sentTasks, openTopics, closedTopics, archived } = prepareTopicsGroups(topics);

  const [isShowingArchivedTimeline, { toggle: toggleShowArchived }] = useBoolean(false);

  const unarchivedGroups: RequestsGroupProps[] = computed(() => {
    const groups: RequestsGroupProps[] = [];
    if (receivedTasks.length > 0) {
      groups.push({
        groupName: "Received",
        topics: receivedTasks,
      });
    }
    if (sentTasks.length > 0) {
      groups.push({
        groupName: "Sent",
        topics: sentTasks,
      });
    }
    if (openTopics.length > 0) {
      groups.push({
        groupName: "Open",
        topics: openTopics,
      });
    }
    if (closedTopics.length > 0) {
      groups.push({
        groupName: "Closed",
        topics: closedTopics,
      });
    }
    if (showArchived && archived.length > 0) {
      groups.push({
        groupName: "Archived",
        topics: archived,
      });
    }
    return groups;
  }).get();

  // MBA m1 2021 -> 26 ms to process
  const archivedGroups: RequestsGroupProps[] = useArchivedGroups(archived);

  const unarchivedRows = useMemo(() => convertGroupsToVirtualizedRows(unarchivedGroups), [unarchivedGroups]);
  const archivedRows = useMemo(() => convertGroupsToVirtualizedRows(archivedGroups), [archivedGroups]);

  return (
    <UIHolder ref={ref} data-test-id="sidebar-all-request-groups">
      {archived && archived.length > 0 && (
        <UIArchivedToggle
          layout="position"
          layoutId="sidebar-archive-toggle"
          transition={{ duration: ANIMATION_DURATION }}
          initial={{ y: 0 }}
          animate={{
            y: isShowingArchivedTimeline ? -boundingBox.height + 58 : 0,
          }}
          onClick={toggleShowArchived}
          $isShowingArchived={isShowingArchivedTimeline}
        >
          {!isShowingArchivedTimeline && <>Show recently archived requests</>}
          {isShowingArchivedTimeline && <>Hide recently archived requests</>}
          <IconChevronDown />
        </UIArchivedToggle>
      )}

      <AnimatePresence key="first" initial={false}>
        {!isShowingArchivedTimeline && (
          <UIFeedGroups
            key="unarchived"
            layout="position"
            layoutId="sidebar-unarchived-topics"
            // Add height of UIArchiveToggle + padding from top
            initial={{ y: -boundingBox.height + 60, opacity: 0.2 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -boundingBox.height + 60, opacity: 0.2 }}
            transition={{ duration: ANIMATION_DURATION }}
          >
            <List<VirtualizedRow[]>
              itemCount={unarchivedRows.length}
              itemKey={getVirtualizedRowKey}
              itemData={unarchivedRows}
              itemSize={70}
              height={boundingBox.height - 60}
              width={boundingBox.width}
            >
              {renderRow}
            </List>
          </UIFeedGroups>
        )}
      </AnimatePresence>

      <AnimatePresence key="second">
        {isShowingArchivedTimeline && (
          <UIFeedGroups
            $isOnTop
            key="archived"
            layout="position"
            layoutId="sidebar-archived-topics"
            initial={{ y: boundingBox.height, opacity: 0.2 }}
            animate={{ y: 50, opacity: 1 }}
            exit={{ y: boundingBox.height, opacity: 0.2 }}
            transition={{ duration: ANIMATION_DURATION }}
          >
            <List<VirtualizedRow[]>
              itemCount={archivedRows.length}
              itemKey={getVirtualizedRowKey}
              itemData={archivedRows}
              itemSize={70}
              height={boundingBox.height - 60}
              width={boundingBox.width}
            >
              {renderRow}
            </List>
          </UIFeedGroups>
        )}
      </AnimatePresence>
    </UIHolder>
  );
});

function getVirtualizedRowKey(index: number, data: VirtualizedRow[]) {
  return data[index].key;
}

function renderRow({ data, index, style }: ListChildComponentProps<VirtualizedRow[]>) {
  return (
    <div style={style}>
      <Row item={data[index]} />
    </div>
  );
}

const Row = observer(function Row({ item }: { item: VirtualizedRow }) {
  return (
    <UIItem key={item.key}>
      {item.type === "header" && <>{item.label}</>}
      {item.type === "topic" && <RequestItem topic={item.topic} />}
    </UIItem>
  );
});

const UIItem = styled.div<{}>``;

const UIHolder = styled.div<{}>`
  position: relative;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const UIFeedGroups = styled(motion.div)<{ $isOnTop?: boolean }>`
  position: absolute;
  bottom: 0;
  padding-bottom: 60px;
  overflow-y: auto;
  height: 100%;

  ${theme.colors.layout.backgroundAccent.asBg}

  ${(props) =>
    props.$isOnTop
      ? css`
          z-index: 3;
        `
      : css`
          z-index: 1;
        `}
`;

const UIArchivedToggle = styled(motion.div)<{ $isShowingArchived: boolean }>`
  position: absolute;
  z-index: 4;
  bottom: 0;

  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 16px;

  /* in line with rest of content */
  padding-left: 22px;

  svg {
    font-size: 25px;
  }
  ${(props) =>
    props.$isShowingArchived
      ? css`
          border-top-width: 0px;
          svg {
            transform: rotate(180deg);
            transition-duration: ${ANIMATION_DURATION}s;
          }
        `
      : css`
          svg {
            transform: rotate(360deg);
            transition-duration: ${ANIMATION_DURATION}s;
          }
        `}
  ${theme.typo.content.semibold}
  ${theme.colors.text.asColor}
  ${theme.colors.layout.backgroundAccent.asBg}  
  cursor: pointer;

  border-color: rgba(0, 0, 0, 0.05);
  border-style: solid;
  border-top-width: 1px;
  border-bottom-width: 1px;
`;
