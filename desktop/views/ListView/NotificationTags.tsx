import React from "react";
import styled from "styled-components";

import { NotificationTag } from "@aca/desktop/domains/notification/tag";
import { styledObserver } from "@aca/shared/component";

import { NotificationTagDisplayer } from "./NotificationTag";
import { NotificationRowZIndex } from "./shared";

interface Props {
  tags: NotificationTag[];
}

export const NotificationTags = styledObserver(({ tags }: Props) => {
  return (
    <UIHolder>
      {tags.map((tag, index) => {
        return <NotificationTagDisplayer key={index} tag={tag} />;
      })}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  gap: 6px;
  z-index: ${NotificationRowZIndex.rowItem};
`;
