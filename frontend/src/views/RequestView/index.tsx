import React from "react";
import styled from "styled-components";

import { SidebarLayout } from "~frontend/layouts/SidebarLayout";

interface Props {
  topicId: string;
}

export function RequestView({ topicId }: Props) {
  return (
    <SidebarLayout selectedTopicId={topicId}>
      <UIHolder>{topicId}</UIHolder>
    </SidebarLayout>
  );
}

const UIHolder = styled.div<{}>``;
