import gql from "graphql-tag";
import React from "react";

import { withFragments } from "~frontend/gql/utils";
import { DashboardTopicCard_TopicFragment } from "~gql";

const fragments = {
  topic: gql`
    fragment DashboardTopicCard_topic on topic {
      id
    }
  `,
};

interface Props {
  topic: DashboardTopicCard_TopicFragment;
}

export const DashboardTopicCard = withFragments(fragments, ({ topic }: Props) => {
  return <p>{topic.id}</p>;
});
