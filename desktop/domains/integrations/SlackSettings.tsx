import { observer } from "mobx-react";
import React from "react";

import { toggleSlackAutoResolve } from "@aca/desktop/actions/slack";
import { getDb } from "@aca/desktop/clientdb";
import { authStore } from "@aca/desktop/store/auth";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { Toggle } from "@aca/ui/toggle";

export const SlackSettings = observer(() => {
  const user = getDb().user.findById(authStore.assertUserTokenData.id);

  return (
    <SettingRow
      title="Resolve with reply"
      description=" Automatically resolve Slack messages to which you reply or react"
    >
      <ActionTrigger action={toggleSlackAutoResolve}>
        <Toggle isDisabled isSet={user?.is_slack_auto_resolve_enabled} />
      </ActionTrigger>
    </SettingRow>
  );
});
