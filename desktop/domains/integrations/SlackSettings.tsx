import { observer } from "mobx-react";
import React from "react";

import { toggleSlackAutoResolve } from "@aca/desktop/actions/slack";
import { accountStore } from "@aca/desktop/store/account";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { ListFilters } from "@aca/desktop/ui/Filters";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { VStack } from "@aca/ui/Stack";
import { Toggle } from "@aca/ui/toggle";

export const SlackSettings = observer(() => {
  const user = accountStore.assertUser;
  return (
    <VStack gap={16}>
      <SettingRow
        title="Resolve with reply"
        description="Automatically resolve Slack messages to which you reply or react"
      >
        <ActionTrigger action={toggleSlackAutoResolve}>
          <Toggle isDisabled isSet={user?.is_slack_auto_resolve_enabled} />
        </ActionTrigger>
      </SettingRow>

      <VStack gap={8}>
        <SettingRow title="Filter conversations" description="Select which conversation types should be imported" />
        <ListFilters
          value={user.importFilters}
          onChange={(filters) => {
            user.update({ import_filters: filters });
          }}
          singleType="notification_slack_message"
        />
      </VStack>
    </VStack>
  );
});
