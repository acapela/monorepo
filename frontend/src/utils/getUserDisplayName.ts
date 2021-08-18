import { gql } from "@apollo/client";

import { withFragments } from "~frontend/gql/utils";
import { GetUserDisplayName_UserFragment } from "~gql";

export const getUserDisplayName = withFragments(
  {
    user: gql`
      fragment GetUserDisplayName_user on user {
        name
        email
      }
    `,
  },
  (user: GetUserDisplayName_UserFragment) => user.name ?? user.email ?? "Unknown user"
);
