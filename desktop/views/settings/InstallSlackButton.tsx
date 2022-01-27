import { gql, useQuery } from "@apollo/client";
import React from "react";

import { connectSlackBridge } from "@aca/desktop/bridge/auth";
import { GetSlackInstallationUrlQuery, GetSlackInstallationUrlQueryVariables } from "@aca/gql";
import { isServer } from "@aca/shared/isServer";
import { Button } from "@aca/ui/buttons/Button";

export function InstallSlackButton({ teamId }: { teamId: string }) {
  const { data: slackInstallationData } = useQuery<GetSlackInstallationUrlQuery, GetSlackInstallationUrlQueryVariables>(
    gql`
      query GetSlackInstallationURL($input: GetTeamSlackInstallationURLInput!) {
        slackInstallation: get_team_slack_installation_url(input: $input) {
          url
        }
      }
    `,
    {
      skip: isServer,
      variables: { input: { team_id: teamId, with_bot: true, redirectURL: isServer ? "" : location.href } },
    }
  );
  const url = slackInstallationData?.slackInstallation?.url;
  return (
    <Button disabled={!url} onClick={() => url && connectSlackBridge({ url })}>
      Connect Slack
    </Button>
  );
}
