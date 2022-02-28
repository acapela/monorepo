import { observer } from "mobx-react";
import React from "react";

import { connectSlack } from "@aca/desktop/actions/slack";
import { accountStore } from "@aca/desktop/store/account";

import { Toast } from "./Toast";

export const SlackToasts = observer(() => {
  const slackInstallation = accountStore.user?.slackInstallation;
  const hasSomeButNotAllScopes = Boolean(slackInstallation && !slackInstallation?.hasAllScopes);
  return hasSomeButNotAllScopes ? (
    <Toast
      title="Missing Slack permissions"
      description="A permission update is needed to make the Slack integration work smoothly"
      action={connectSlack}
    />
  ) : null;
});
