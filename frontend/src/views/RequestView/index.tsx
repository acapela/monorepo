import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { SidebarLayout } from "~frontend/layouts/SidebarLayout";

import { TopicWithMessages } from "./TopicWithMessages";

interface Props {
  topicId: string;
}

export const RequestView = observer(({ topicId }: Props) => {
  const db = useDb();
  const topic = db.topic.findById(topicId);
  return (
    <SidebarLayout selectedTopicId={topicId}>
      <UIHolder>{topic && <TopicWithMessages topic={topic} />}</UIHolder>
    </SidebarLayout>
  );
});

const UIHolder = styled.div<{}>``;
