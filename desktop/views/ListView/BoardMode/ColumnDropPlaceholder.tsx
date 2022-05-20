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
import { boardModeStore } from "./store";

interface Props {
  label: NotificationStatusLabelEntity | null;
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

export const ColumnDropPlaceholder = observer(function BoardMode({ label = null }: Props) {
  const { setNodeRef } = useDroppable({ id: label?.id ?? "inbox-label", data: { label } });

  return <UIHolder ref={setNodeRef}>DROP ME</UIHolder>;
});

const UIHolder = styled.div`
  /* flex-basis: 0; */
  background-color: red;
  flex-grow: 1;
`;
