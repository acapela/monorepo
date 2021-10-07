import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";

import { TopicWithMessages } from "./TopicWithMessages";

interface Props {
  topicSlug: string;
}

export const RequestView = observer(({ topicSlug }: Props) => {
  const db = useDb();
  const topic = db.topic.findByUniqueIndex("slug", topicSlug);
  return <UIHolder>{topic && <TopicWithMessages topic={topic} />}</UIHolder>;
});

const UIHolder = styled.div<{}>``;
