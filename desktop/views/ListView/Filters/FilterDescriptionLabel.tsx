import styled from "styled-components";

import { NotificationFilter, getIsFilterOfType } from "./types";

interface Props {
  filter: NotificationFilter;
}

export function FilterDescriptionLabel({ filter }: Props) {
  if (getIsFilterOfType(filter, "notification_figma_comment")) {
    return (
      <>
        <UIIntegration>Figma</UIIntegration> {filter.is_mention}
      </>
    );
  }

  return null;
}

const UIIntegration = styled.strong``;
