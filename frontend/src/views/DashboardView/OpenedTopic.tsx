import { gql, useQuery } from "@apollo/client";

import { OpenedTopicQuery, OpenedTopicQueryVariables } from "~gql/generated";

import { TopicWithMessages } from "../RoomView/TopicWithMessages";

interface Props {
  topicId: string;
}

export function OpenedTopic({ topicId }: Props) {
  const { data, loading } = useQuery<OpenedTopicQuery, OpenedTopicQueryVariables>(
    gql`
      ${TopicWithMessages.fragments.topic}
      query OpenedTopic($topicId: uuid!) {
        topic: topic_by_pk(id: $topicId) {
          ...TopicWithMessages_topic
        }
      }
    `,
    { variables: { topicId } }
  );

  const topic = data?.topic ?? null;

  if (!topic) return null;

  return <TopicWithMessages topic={topic} />;
}
