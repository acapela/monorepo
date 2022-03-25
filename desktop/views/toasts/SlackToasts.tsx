import React from "react";

import { connectSlack } from "@aca/desktop/actions/slack";
import { accountStore } from "@aca/desktop/store/account";

import { MetaToastProps, Toast } from "./Toast";

export function renderSlackToasts(metaProps: MetaToastProps) {
  const slackInstallations = accountStore.user?.slackInstallations.all;

  const slackInstallationsToShowWarningAbout = slackInstallations?.filter((install) =>
    Boolean(install && !install.hasAllScopes)
  );

  if (!slackInstallationsToShowWarningAbout) return null;

  return slackInstallationsToShowWarningAbout.map((incorrectSlackInstallation) => (
    <Toast
      key={incorrectSlackInstallation.id}
      id={incorrectSlackInstallation.id}
      title={`Missing Slack permissions for ${incorrectSlackInstallation.team_name}`}
      message="A permission update is needed to make the Slack integration work smoothly"
      actionObject={{
        action: connectSlack,
        target: { id: incorrectSlackInstallation.team_id, name: incorrectSlackInstallation.team_name, kind: "account" },
      }}
      {...metaProps}
    />
  ));
}
