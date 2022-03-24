import { observer } from "mobx-react";
import React from "react";

import { connectSlack } from "@aca/desktop/actions/slack";
import { accountStore } from "@aca/desktop/store/account";

import { Toast } from "./Toast";

export const SlackToasts = observer(() => {
  const slackInstallations = accountStore.user?.slackInstallations.all;
  return (
    <>
      {slackInstallations
        ?.filter((install) => Boolean(install && !install.hasAllScopes))
        .map((install) => (
          <Toast
            key={install.id}
            id={install.id}
            title={`Missing Slack permissions for ${install.team_name}`}
            description="A permission update is needed to make the Slack integration work smoothly"
            action={connectSlack}
            target={{ id: install.team_id, name: install.team_name, kind: "account" }}
          />
        ))}
    </>
  );
});
