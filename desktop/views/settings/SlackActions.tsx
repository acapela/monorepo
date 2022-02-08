import { observer } from "mobx-react";
import React from "react";

import { connectSlack, toggleSlackAutoResolve } from "@aca/desktop/actions/slack";
import { getDb } from "@aca/desktop/clientdb";
import { authStore } from "@aca/desktop/store/authStore";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { HStack } from "@aca/ui/Stack";
import { Toggle } from "@aca/ui/toggle";

export const SlackActions = observer(() => {
  const user = getDb().user.findById(authStore.user.id);
  return (
    <HStack alignItems="center" gap={10}>
      <ActionButton action={connectSlack} />
      {user?.has_slack_installation && (
        <HStack alignItems="center" gap={5}>
          <ActionTrigger action={toggleSlackAutoResolve}>
            <Toggle isDisabled isSet={user.is_slack_auto_resolve_enabled} />
            Automatically resolve Slack messages to which you reply or react
          </ActionTrigger>
        </HStack>
      )}
    </HStack>
  );
});
