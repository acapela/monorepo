import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useBoundingBox } from "~shared/hooks/useBoundingBox";
import { IconChevronDown } from "~ui/icons";
import { theme } from "~ui/theme";

import { RequestsGroup, RequestsGroupProps } from "../RequestsGroup";
import { prepareTopicsGroups } from "./prepareTopicsGroups";
import { useArchivedGroups } from "./useArchivedGroups";

interface Props {
  topics: TopicEntity[];
  showArchived?: boolean;
}

const ANIMATION_DURATION = 0.55;

export const RequestFeedGroups = observer(({ topics, showArchived = false }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const boundingBox = useBoundingBox(ref);

  // MBA m1 2021 -> 186 ms to process (archived orderBy is main culprit)
  const { receivedTasks, sentTasks, openTopics, closedTopics, archived } = prepareTopicsGroups(topics);

  const [isShowingArchivedTimeline, { toggle: toggleShowArchived }] = useBoolean(false);

  // MBA m1 2021 -> 26 ms to process
  const archivedGroups: RequestsGroupProps[] = useArchivedGroups(archived);

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
          <UIScrollableGroup
            key="unarchived"
            layout="position"
            layoutId="sidebar-unarchived-topics"
            // Add height of UIArchiveToggle + padding from top
            initial={{ y: -boundingBox.height + 60, opacity: 0.2 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -boundingBox.height + 60, opacity: 0.2 }}
            transition={{ duration: ANIMATION_DURATION }}
          >
            {!!receivedTasks.length && <RequestsGroup key="Received" topics={receivedTasks} groupName="Received" />}
            {!!sentTasks.length && <RequestsGroup key="Sent" topics={sentTasks} groupName="Sent" />}
            {!!openTopics.length && <RequestsGroup key="Open" topics={openTopics} groupName="Open" />}
            {!!closedTopics.length && <RequestsGroup key="Closed" topics={closedTopics} groupName="Closed" />}
            {showArchived && !!archived.length && (
              <RequestsGroup key="Archived" topics={archived} groupName="Archived" />
            )}
          </UIScrollableGroup>
        )}
      </AnimatePresence>

      <AnimatePresence key="second">
        {isShowingArchivedTimeline && (
          <UIScrollableGroup
            $isOnTop
            key="archived"
            layout="position"
            layoutId="sidebar-archived-topics"
            initial={{ y: boundingBox.height, opacity: 0.2 }}
            animate={{ y: 50, opacity: 1 }}
            exit={{ y: boundingBox.height, opacity: 0.2 }}
            transition={{ duration: ANIMATION_DURATION }}
          >
            {archivedGroups.map(({ groupName, topics }) => (
              <RequestsGroup key={groupName} topics={topics} groupName={groupName} />
            ))}
          </UIScrollableGroup>
        )}
      </AnimatePresence>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  position: relative;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const UIScrollableGroup = styled(motion.div)<{ $isOnTop?: boolean }>`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  position: absolute;

  padding-bottom: 60px;
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
