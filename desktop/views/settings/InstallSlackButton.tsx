import { gql } from "@apollo/client";
import React from "react";

import { apolloClient } from "@aca/desktop/apolloClient";
import { connectSlackBridge } from "@aca/desktop/bridge/auth";
import { GetIndividualSlackInstallationUrlQuery, GetIndividualSlackInstallationUrlQueryVariables } from "@aca/gql";
import { useAsyncEffect } from "@aca/shared/hooks/useAsyncEffect";
import { Button } from "@aca/ui/buttons/Button";

export function InstallSlackButton() {
  const [installationURL, setInstallationURL] = React.useState<string | null>(null);
  useAsyncEffect(async ({ getIsCancelled }) => {
    const {
      data: { slackInstallation },
    } = await apolloClient.query<
      GetIndividualSlackInstallationUrlQuery,
      GetIndividualSlackInstallationUrlQueryVariables
    >({
      query: gql`
        query GetIndividualSlackInstallationURL($input: GetSlackInstallationURLInput!) {
          slackInstallation: get_slack_installation_url(input: $input) {
            url
          }
        }
      `,
      variables: { input: { redirectURL: "" } },
    });
    if (!getIsCancelled()) {
      setInstallationURL(slackInstallation?.url ?? null);
    }
  });

  return (
    <Button disabled={!installationURL} onClick={() => installationURL && connectSlackBridge({ url: installationURL })}>
      Connect Slack
    </Button>
  );
}
