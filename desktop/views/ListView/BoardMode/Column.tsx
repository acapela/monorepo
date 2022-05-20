import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import { uniq } from "lodash";
import { computed } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { AutoSizer, List } from "react-virtualized";
import styled from "styled-components";

import { NotificationStatusLabelEntity } from "@aca/desktop/clientdb/notificationStatusLabel";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { areArraysShallowEqual } from "@aca/shared/array";
import { isNotNullish } from "@aca/shared/nullish";
import { FadePresenceAnimator } from "@aca/ui/animations";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconTrash } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { BoardSortableRow } from "./BoardSortableRow";
import { ColumnDropPlaceholder } from "./ColumnDropPlaceholder";
import { boardModeStore } from "./store";

interface Props {
  label: NotificationStatusLabelEntity | null;
  allNotifications: NotificationOrGroup[];
}

function insertItemAtIndex<T>(items: T[], item: T, index: number) {
  return [...items.slice(0, index), item, ...items.slice(index)];
}

function getAcceptedLabels(notificationOrGroup: NotificationOrGroup) {
  if (getIsNotificationsGroup(notificationOrGroup)) {
    const allLabels = notificationOrGroup.notifications
      .map((notification) => notification.statusLabel)
      .filter(isNotNullish);
    if (allLabels.length === 0) return null;

    return uniq(allLabels);
  }

  const label = notificationOrGroup.statusLabel;

  if (!label) return null;

  return [label];
}

function getIsItemMatchingLabel(notificationOrGroup: NotificationOrGroup, label: NotificationStatusLabelEntity | null) {
  const acceptedLabels = getAcceptedLabels(notificationOrGroup);

  if (!acceptedLabels) {
    return !label;
  }

  if (!label) return false;

  return acceptedLabels.includes(label);
}

export const BoardColumn = observer(function BoardMode({ allNotifications, label = null }: Props) {
  function getItemsForLabel() {
    return allNotifications.filter((notificationOrGroup) => {
      return getIsItemMatchingLabel(notificationOrGroup, label);
    });
  }

  const itemsForLabel = getItemsForLabel();

  function getItemsToShow() {
    const { dragPosition } = boardModeStore;

    if (!dragPosition) return itemsForLabel;

    if (itemsForLabel.includes(dragPosition.item)) {
      if (dragPosition.label === label) {
        return itemsForLabel;
      } else {
        return itemsForLabel.filter((item) => dragPosition.item !== item);
      }
    }

    if (dragPosition.label === label) {
      return insertItemAtIndex(itemsForLabel, dragPosition.item, dragPosition.index);
    }

    return itemsForLabel;
  }

  const getItemsToShowComputed = computed(getItemsToShow, { equals: areArraysShallowEqual });

  const itemsToShow = getItemsToShowComputed.get();

  const ids = itemsToShow.map((item) => item.id);

  const node = (
    <UIHolder>
      <UITitle>
        <UITitleText>{label?.name ?? "Inbox"}</UITitleText>
        <UITitleCount>
          <AnimatePresence>
            <UICountIndicator transition={{ type: "spring", duration: 0.5, bounce: 0 }} key={itemsToShow.length}>
              {itemsToShow.length}
            </UICountIndicator>
          </AnimatePresence>
          <UICountIndicatorPlaceholder>{itemsToShow.length}</UICountIndicatorPlaceholder>
        </UITitleCount>
        {label && (
          <IconButton
            icon={<IconTrash />}
            size="compact"
            onClick={() => {
              label.remove();
            }}
          />
        )}
      </UITitle>
      {ids.length > 0 && (
        <UIItemsHolder>
          <SortableContext items={ids} strategy={verticalListSortingStrategy} id={label?.id ?? "inbox-label"}>
            <AutoSizer>
              {({ height, width }) => {
                return (
                  <List
                    rowCount={itemsToShow.length}
                    width={width}
                    rowHeight={48}
                    height={height}
                    rowRenderer={(row) => {
                      const { index, style } = row;

                      const item = itemsToShow[index];

                      return (
                        <RowHolder style={style} key={item.id}>
                          <BoardSortableRow item={item} label={label} />
                        </RowHolder>
                      );
                    }}
                  ></List>
                );
              }}
            </AutoSizer>
          </SortableContext>
        </UIItemsHolder>
      )}
      <ColumnDropPlaceholder label={label} />
    </UIHolder>
  );

  return node;
});

const UIHolder = styled.div`
  max-width: 400px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const UITitle = styled.div`
  ${theme.colors.layout.backgroundAccent.withBorder.asBgWithReadableText};
  padding: 10px 15px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UITitleText = styled.div`
  flex-grow: 1;
  ${theme.typo.content.semibold};
`;

const UITitleCount = styled.div`
  opacity: 0.5;
  ${theme.colors.layout.backgroundAccent.active.withBorder.asBgWithReadableText};
  padding: 5px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  position: relative;
`;

const UICountIndicator = styled(FadePresenceAnimator)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const UICountIndicatorPlaceholder = styled.div`
  opacity: 0;
`;

const UIItemsHolder = styled.div`
  flex-grow: 1000000;
  align-items: stretch;
`;

const RowHolder = styled.div`
  /* transition: 0.2s all; */
`;
