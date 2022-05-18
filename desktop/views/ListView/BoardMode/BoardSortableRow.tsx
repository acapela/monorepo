import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { computed } from "mobx";
import { observer } from "mobx-react";
import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";

import { NotificationOrGroupRow } from "../NotificationOrGroupRow";
import { boardModeStore } from "./store";

interface Props {
  item: NotificationOrGroup;
  isDisabled?: boolean;
}

export const SortableBoardSortableRow = observer(function BoardSortableRow({ item }: Props) {
  const data = useMemo(() => ({ item }), [item]);
  const { attributes, listeners, setNodeRef, transform, transition, active } = useSortable({
    id: item.id,
    data: data,
  });

  const isActive = active?.id === item.id;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isActive ? 0 : 1,
  };

  return (
    <UIHolder ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <NotificationOrGroupRow notificationOrGroup={item} />
    </UIHolder>
  );
});

function useIsVisible(ref: RefObject<HTMLDivElement>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: [0, 1] }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isVisible;
}

export const BoardSortableRow = observer(function BoardSortableRow(props: Props) {
  return <SortableBoardSortableRow {...props} />;

  const holderRef = useRef<HTMLDivElement>(null);

  const isActive = computed(() => boardModeStore.dragPosition?.item === props.item).get();

  const isVisible = useIsVisible(holderRef) || isActive;

  function renderRow() {
    if (isVisible) {
      return <SortableBoardSortableRow {...props} />;
    }

    return <NotificationOrGroupRow notificationOrGroup={props.item} />;
  }

  return <UIHolder ref={holderRef}>{renderRow()}</UIHolder>;
});

const UIHolder = styled.div``;
