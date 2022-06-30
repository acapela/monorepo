import { gql } from "@apollo/client";

import { apolloClient } from "@aca/desktop/apolloClient";
import { SlackConversationsQuery, SlackUsersQuery } from "@aca/gql";
import { createObservablePromiseCache } from "@aca/shared/mobx/promiseCache";

export const getSlackUsers = createObservablePromiseCache(async () => {
  const { data } = await apolloClient.query<SlackUsersQuery>({
    query: gql`
      query SlackUsers {
        slack_users {
          workspace_id
          id
          display_name
          real_name
          avatar_url
          conversation_id
          is_bot
        }
      }
    `,
  });

  return data?.slack_users ?? [];
}, []);

export const getSlackConversations = createObservablePromiseCache(async () => {
  const { data } = await apolloClient.query<SlackConversationsQuery>({
    query: gql`
      query SlackConversations {
        slack_conversations {
          workspace_id
          id
          name
          is_private
        }
      }
    `,
  });
  return data?.slack_conversations ?? [];
}, []);

setTimeout(
  () => {
    getSlackUsers.reloadValue();
    getSlackConversations.reloadValue();
  },
  // Important! Don't set it to too short, as it is using apollo, and apollo is batching requests together. If it starts quickly
  // it would get batched together with 'bootstrap' requests. As getting slack users is quite long and not really needed for initial boot
  // it would unnecesarily slow down the initial boot.
  2000
);
