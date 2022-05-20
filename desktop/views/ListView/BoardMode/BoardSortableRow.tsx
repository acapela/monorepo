import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { NotificationStatusLabelEntity } from "@aca/desktop/clientdb/notificationStatusLabel";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";

import { NotificationOrGroupRow } from "../NotificationOrGroupRow";

interface Props {
  item: NotificationOrGroup;
  label: NotificationStatusLabelEntity | null;
  isDisabled?: boolean;
}

export const BoardSortableRow = observer(function BoardSortableRow({ item, label }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, active } = useSortable({
    id: item.id,
    data: { item, label },
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

const UIHolder = styled.div``;
