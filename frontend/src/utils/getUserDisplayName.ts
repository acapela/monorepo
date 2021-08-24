import { gql } from "@apollo/client";

import { withFragments } from "~frontend/gql/utils";
import { GetUserDisplayName_UserFragment } from "~gql";

const fragments = {
  user: gql`
    fragment GetUserDisplayName_user on user {
      name
      email
    }
  `,
};

export const getUserDisplayName = withFragments(
  fragments,
  (user: GetUserDisplayName_UserFragment) => user.name ?? user.email ?? "Unknown user"
);
