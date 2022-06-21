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
    fetchPolicy: "no-cache",
  });
  return data?.slack_conversations ?? [];
}, []);

setTimeout(() => {
  getSlackUsers.reloadValue();
  getSlackConversations.reloadValue();
}, 500);
