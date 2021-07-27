import { gql } from "@apollo/client";
import { LookupTeamNameQuery, LookupTeamNameQueryVariables } from "~gql";

import { createQuery } from "./utils";

export const [lookupTeamName] = createQuery<LookupTeamNameQuery, LookupTeamNameQueryVariables>(
  () => gql`
    query LookupTeamName($token: String!) {
      invite: lookup_team_name(token: $token) {
        team_name
        inviter_name
      }
    }
  `
);
