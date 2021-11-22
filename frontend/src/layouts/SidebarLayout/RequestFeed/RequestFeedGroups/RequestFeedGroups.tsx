import { AnimatePresence, motion } from "framer-motion";
import { computed } from "mobx";
import { observer } from "mobx-react";
import React, { memo, useMemo, useRef } from "react";
import { VariableSizeList as List, ListChildComponentProps, areEqual } from "react-window";
import styled, { css } from "styled-components";

import { useLastValue } from "~frontend/../../shared/hooks/useLastValue";
import { TopicEntity } from "~frontend/clientdb/topic";
import { usePersistedState } from "~frontend/hooks/usePersistedState";
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
  groupName: string;
};

type TopicRow = {
  type: "topic";
  key: string;
  groupName: string;
  topic: TopicEntity;
};

type VirtualizedRow = HeaderRow | TopicRow;

const SPACE_ALLOCATED_FOR_HEADER_IN_PX = 40;
const SPACE_ALLOCATED_FOR_REQUEST_TITLES_WITH_1_LINE_IN_PX = 55;
const SPACE_ALLOCATED_FOR_REQUEST_TITLES_WITH_2_LINES_IN_PX = 69;

const AMOUNT_OF_CHARACTERS_IN_1_REQUEST_TITLE_LINE = 28;

const HEIGHT_OF_ARCHIVED_LIST_TOGGLE = 60;

function convertGroupsToVirtualizedRows(groups: RequestsGroupProps[]): [VirtualizedRow[], number[]] {
  const rowsData: VirtualizedRow[] = [];
  const rowsHeight: number[] = [];

  for (const { groupName, topics } of groups) {
    rowsData.push({ type: "header", groupName: groupName, key: groupName });
    rowsHeight.push(SPACE_ALLOCATED_FOR_HEADER_IN_PX);
    for (const topic of topics) {
      rowsData.push({ type: "topic", topic, key: topic.id, groupName });
      const hasTopicTitleMoreThan2Lines = topic.name.length > AMOUNT_OF_CHARACTERS_IN_1_REQUEST_TITLE_LINE;
      rowsHeight.push(
        hasTopicTitleMoreThan2Lines
          ? SPACE_ALLOCATED_FOR_REQUEST_TITLES_WITH_2_LINES_IN_PX
          : SPACE_ALLOCATED_FOR_REQUEST_TITLES_WITH_1_LINE_IN_PX
      );
    }
  }

  return [rowsData, rowsHeight];
}

function useVirtualRowConverter(
  groups: RequestsGroupProps[],
  onListHeightUpdate: (index: number) => void
): [VirtualizedRow[], number[]] {
  const [dataRows, heightRows] = useMemo(() => convertGroupsToVirtualizedRows(groups), [groups]);
  const previousHeightRows = useLastValue(heightRows);

  if (previousHeightRows) {
    for (let i = 0; i < heightRows.length && i < previousHeightRows?.length; i++) {
      if (heightRows[i] !== previousHeightRows[i]) {
        // Forces react-window to redo its internal item height cache
        onListHeightUpdate(i);
        break;
      }
    }
  }

  return [dataRows, heightRows];
}

export const RequestFeedGroups = observer(({ topics, showArchived = false }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const boundingBox = useBoundingBox(containerRef);

  const unarchivedListRef = useRef<List>(null);
  const archivedListRef = useRef<List>(null);

  // MBA m1 2021 -> 186 ms to process (archived orderBy is main culprit)
  const { receivedTasks, sentTasks, openTopics, closedTopics, archived } = computed(() =>
    prepareTopicsGroups(topics)
  ).get();

  // Allows the archived list to remain shown if changing route with same layout
  const [isShowingArchivedTimeline, setShowArchivedTimeline] = usePersistedState({
    key: "is-showing-archived-timeline",
    initialValue: false,
  });

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

  // MBA m1 2021 -> 26 ms to process 1 year worth of topics ~600
  const archivedGroups: RequestsGroupProps[] = useArchivedGroups(archived);

  const [unarchivedRows, unarchiveHeights] = useVirtualRowConverter(unarchivedGroups, (i) =>
    unarchivedListRef.current?.resetAfterIndex(i, true)
  );
  const [archivedRows, archiveHeights] = useVirtualRowConverter(archivedGroups, (i) =>
    archivedListRef.current?.resetAfterIndex(i, true)
  );

  const [isFirstToggleRender, { unset: setFirstToggleRenderAsComplete }] = useBoolean(true);

  function toggleShowArchived() {
    setFirstToggleRenderAsComplete();
    setShowArchivedTimeline(!isShowingArchivedTimeline);
  }

  return (
    <UIHolder ref={containerRef} data-test-id="sidebar-all-request-groups">
      {archived && archived.length > 0 && (
        <UIArchivedToggle
          layout="position"
          layoutId="sidebar-archive-toggle"
          transition={{ duration: isFirstToggleRender ? 0 : ANIMATION_DURATION }}
          initial={{ y: 0 }}
          animate={{
            // include height of Archive Toggle itself minus border
            y: isShowingArchivedTimeline ? -boundingBox.height + HEIGHT_OF_ARCHIVED_LIST_TOGGLE - 2 : 0,
          }}
          onClick={toggleShowArchived}
          $isShowingArchived={isShowingArchivedTimeline}
        >
          {!isShowingArchivedTimeline && <>Show archived requests</>}
          {isShowingArchivedTimeline && <>Hide archived requests</>}
          <IconChevronDown />
        </UIArchivedToggle>
      )}

      {/* initial={false} prevents the list from scrolling from it's hiding place on page load */}
      <AnimatePresence initial={false} key="sidebar-presence-unarchived">
        {!isShowingArchivedTimeline && (
          <UIFeedGroups
            key="unarchived"
            layout="position"
            layoutId="sidebar-unarchived-topics"
            // Add height of UIArchiveToggle + padding from top
            initial={{ y: -boundingBox.height + HEIGHT_OF_ARCHIVED_LIST_TOGGLE, opacity: 0.2 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -boundingBox.height + HEIGHT_OF_ARCHIVED_LIST_TOGGLE, opacity: 0.2 }}
            transition={{ duration: ANIMATION_DURATION }}
          >
            <List<VirtualizedRow[]>
              ref={unarchivedListRef}
              itemCount={unarchivedRows.length}
              itemKey={getVirtualizedRowKey}
              itemData={unarchivedRows}
              itemSize={(index) => unarchiveHeights[index]}
              height={boundingBox.height - HEIGHT_OF_ARCHIVED_LIST_TOGGLE}
              width={boundingBox.width}
            >
              {renderRow}
            </List>
          </UIFeedGroups>
        )}
      </AnimatePresence>

      <AnimatePresence key="sidebar-presence-archived">
        {isShowingArchivedTimeline && (
          <UIFeedGroups
            $isOnTop
            key="archived"
            layout="position"
            layoutId="sidebar-archived-topics"
            initial={{ y: boundingBox.height, opacity: 0.2 }}
            // Should only animate until it reaches the archive toggle
            animate={{ y: HEIGHT_OF_ARCHIVED_LIST_TOGGLE, opacity: 1 }}
            exit={{ y: boundingBox.height, opacity: 0.2 }}
            transition={{ duration: ANIMATION_DURATION }}
          >
            <List<VirtualizedRow[]>
              ref={archivedListRef}
              data-test-id="sidebar-all-request-groups"
              itemCount={archivedRows.length}
              itemKey={getVirtualizedRowKey}
              itemData={archivedRows}
              itemSize={(index) => archiveHeights[index]}
              // Should only be visible outside of the archive toggle box
              height={boundingBox.height - HEIGHT_OF_ARCHIVED_LIST_TOGGLE}
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

const renderRow = memo(function renderRow({ data, index, style }: ListChildComponentProps<VirtualizedRow[]>) {
  return (
    <div style={style}>
      <Row item={data[index]} />
    </div>
  );
}, areEqual);

const Row = observer(function Row({ item }: { item: VirtualizedRow }) {
  return (
    <UIItem key={item.key} data-test-id={`sidebar-request-group-${item.groupName.toLowerCase().split(" ").join("-")}`}>
      {item.type === "header" && <UIGroupName>{item.groupName}</UIGroupName>}
      {item.type === "topic" && <RequestItem topic={item.topic} />}
    </UIItem>
  );
});

const UIItem = styled.div<{}>`
  padding: 12px;
  height: 100%;

  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`;

const UIGroupName = styled.h6<{}>`
  padding-left: 10px;
  padding-bottom: 2px;

  ${theme.typo.item.secondaryTitle}
  opacity: 0.6;
`;

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

  /* z-index are necessary to prevent the archived and unarchived lists from stacking on top of each other. 
  This happens due to different starting and end positions. This way, the archived  list will hide the very end of 
  the unarchived list as it moves */
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

  /* Text is now adjusted to be in same line as rest of sidebar text */
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
  ${theme.typo.content.medium}
  ${theme.colors.text.asColor}
  ${theme.colors.layout.backgroundAccent.asBg}  
  cursor: pointer;

  border-color: rgba(0, 0, 0, 0.05);
  border-style: solid;
  border-top-width: 1px;
  border-bottom-width: 1px;
`;
