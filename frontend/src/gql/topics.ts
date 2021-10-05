/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { gql } from "@apollo/client";

import { TopicDetailedInfoFragment as TopicDetailedInfoFragmentType, TopicsQuery, TopicsQueryVariables } from "~gql";

import { UserBasicInfoFragment } from "./user";
import { createFragment, createQuery } from "./utils";

export const TopicDetailedInfoFragment = createFragment<TopicDetailedInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}

    fragment TopicDetailedInfo on topic {
      id
      name
      index
      slug
      closed_at
      closing_summary
      owner {
        ...UserBasicInfo
      }
      closed_by_user {
        ...UserBasicInfo
      }
      members {
        user {
          ...UserBasicInfo
        }
      }
      lastMessage: messages_aggregate {
        aggregate {
          max {
            created_at
          }
        }
      }
    }
  `
);

export const [useTopicsQuery] = createQuery<TopicsQuery, TopicsQueryVariables>(
  () => gql`
    ${TopicDetailedInfoFragment()}

    query Topics($limit: Int, $orderBy: [topic_order_by!], $where: topic_bool_exp) {
      topics: topic(where: $where, limit: $limit, order_by: $orderBy) {
        ...TopicDetailedInfo
      }
    }
  `
);
