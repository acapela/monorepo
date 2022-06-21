import React from "react";
import styled from "styled-components";

import { NotificationTagDisplayer } from "@aca/desktop/domains/tag/NotificationTag";
import { NotificationTag } from "@aca/desktop/domains/tag/tag";
import { styledObserver } from "@aca/shared/component";

interface Props {
  tags: NotificationTag[];
  className?: string;
}

export const NotificationTagsList = styledObserver(({ tags, className }: Props) => {
  return (
    <UIHolder className={className}>
      {tags.map((tag, index) => {
        return <NotificationTagDisplayer key={index} tag={tag} />;
      })}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  gap: 6px;
`;
