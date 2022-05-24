import { useDroppable } from "@dnd-kit/core";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { NotificationStatusLabelEntity } from "@aca/desktop/clientdb/notificationStatusLabel";

interface Props {
  label: NotificationStatusLabelEntity | null;
}

export const ColumnDropPlaceholder = observer(function BoardMode({ label = null }: Props) {
  const { setNodeRef } = useDroppable({ id: label?.id ?? "inbox-label", data: { label } });

  return <UIHolder ref={setNodeRef}></UIHolder>;
});

const UIHolder = styled.div`
  /* flex-basis: 0; */
  flex-grow: 1;
`;
