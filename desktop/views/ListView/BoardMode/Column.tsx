import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import { computed } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { AutoSizer, List } from "react-virtualized";
import styled from "styled-components";

import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { areArraysShallowEqual } from "@aca/shared/array";
import { FadePresenceAnimator } from "@aca/ui/animations";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconTrash } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { BoardSortableRow } from "./BoardSortableRow";
import { boardModeStore } from "./store";

interface Props {
  id: string;
  items: NotificationOrGroup[];
  isDisabled?: boolean;
}

function insertItemAtIndex<T>(items: T[], item: T, index: number) {
  return [...items.slice(0, index), item, ...items.slice(index)];
}

export const BoardColumn = observer(function BoardMode({ items, id, isDisabled }: Props) {
  function getItemsToShow() {
    const { dragPosition } = boardModeStore;

    if (!dragPosition) return items;

    if (items.includes(dragPosition.item)) {
      if (dragPosition.listId === id) {
        return items;
      } else {
        return items.filter((item) => dragPosition.item !== item);
      }
    }

    if (dragPosition.listId === id) {
      return insertItemAtIndex(items, dragPosition.item, dragPosition.index);
    }

    return items;
  }

  const getItemsToShowComputed = computed(getItemsToShow, { equals: areArraysShallowEqual });

  const itemsToShow = getItemsToShowComputed.get();

  const ids = itemsToShow.map((item) => item.id);

  const node = (
    <UIHolder>
      <UITitle>
        <UITitleText>{id}</UITitleText>
        <UITitleCount>
          <AnimatePresence>
            <UICountIndicator transition={{ type: "spring", duration: 0.5, bounce: 0 }} key={itemsToShow.length}>
              {itemsToShow.length}
            </UICountIndicator>
          </AnimatePresence>
          <UICountIndicatorPlaceholder>{itemsToShow.length}</UICountIndicatorPlaceholder>
        </UITitleCount>
        <IconButton icon={<IconTrash />} size="compact" />
      </UITitle>
      <UIItemsHolder>
        <SortableContext items={ids} strategy={verticalListSortingStrategy} id={id}>
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
                        <BoardSortableRow item={item} isDisabled={isDisabled} />
                      </RowHolder>
                    );
                  }}
                ></List>
              );
            }}
          </AutoSizer>
        </SortableContext>
      </UIItemsHolder>
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
  flex-grow: 1;
`;

const RowHolder = styled.div`
  /* transition: 0.2s all; */
`;
