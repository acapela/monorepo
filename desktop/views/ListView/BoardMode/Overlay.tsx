import { DragOverlay } from "@dnd-kit/core";
import { observer } from "mobx-react";
import React from "react";

import { BodyPortal } from "@aca/ui/BodyPortal";

import { NotificationOrGroupRow } from "../NotificationOrGroupRow";
import { boardModeStore } from "./store";

export const BoardDragOverlay = observer(function BoardDragOverlay() {
  const { dragPosition } = boardModeStore;

  return (
    <BodyPortal>
      <DragOverlay>{dragPosition && <NotificationOrGroupRow notificationOrGroup={dragPosition.item} />}</DragOverlay>
    </BodyPortal>
  );
});
