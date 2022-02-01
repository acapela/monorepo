import { gql } from "@apollo/client";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";

import { apolloClient } from "@aca/desktop/apolloClient";
import { connectSlackBridge } from "@aca/desktop/bridge/auth";
import { getDb } from "@aca/desktop/clientdb";
import { authStore } from "@aca/desktop/store/authStore";
import { GetIndividualSlackInstallationUrlQuery, GetIndividualSlackInstallationUrlQueryVariables } from "@aca/gql";
import { useAsyncEffect } from "@aca/shared/hooks/useAsyncEffect";
import { Button } from "@aca/ui/buttons/Button";

export const InstallSlackButton = observer(() => {
  const [installationURL, setInstallationURL] = useState<string | null>(null);
  const user = getDb().user.findById(authStore.user.id);
  const [closeConnectBridge, setCloseConnectBridge] = useState<(() => void) | null>(null);

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

  useEffect(() => {
    if (user?.has_slack_installation) {
      closeConnectBridge?.();
    }
  }, [user]);

  return (
    <Button
      isDisabled={!user || user.has_slack_installation || !installationURL}
      onClick={() => {
        if (installationURL) {
          const cleanup = connectSlackBridge({ url: installationURL });
          setCloseConnectBridge(cleanup ?? null);
        }
      }}
    >
      Connect Slack
    </Button>
  );
});
