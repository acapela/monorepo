import { gql, useQuery } from "@apollo/client";

import { SlackUsersQuery } from "@aca/gql";

export type SlackQueryUser = SlackUsersQuery["slack_users"][0];

export function useSlackUsers() {
  const { data } = useQuery<SlackUsersQuery>(
    gql`
      query SlackUsers {
        slack_users {
          id
          display_name
          real_name
          avatar_url
        }
      }
    `
  );

  const slackUsers = data?.slack_users ?? [];

  return slackUsers;
}
