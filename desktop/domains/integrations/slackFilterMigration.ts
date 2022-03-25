import { runInAction } from "mobx";

import { getDb } from "@aca/desktop/clientdb";
import { accountStore } from "@aca/desktop/store/account";
import { assert } from "@aca/shared/assert";
import {
  USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER,
  USER_SLACK_CONVERSATIONS_MIGRATED_PLACEHOLDER,
} from "@aca/shared/slack";

import { makeLogger } from "../dev/makeLogger";
import { SlackConversationByTeam, SlackConversationId, SlackWorkspaceId } from "./SlackFilterSettings";

const log = makeLogger("SlackFilterMigration");

export function migrateToNewFilters(availableConversations: SlackConversationByTeam) {
  runInAction(() => {
    const user = accountStore.assertUser;

    const selectedConversationByTeamPreMigration =
      transformPreviousChannelFilterIntoTeamChannelFilteringFormat(availableConversations);

    migrateToNewUserSlackChannelsFiltersByTeam(selectedConversationByTeamPreMigration);

    user.update({
      slack_included_channels: [USER_SLACK_CONVERSATIONS_MIGRATED_PLACEHOLDER],
    });
  });
}

export function migrateToNewUserSlackChannelsFiltersByTeam(
  previouslyExistingSelected: Record<SlackWorkspaceId, SlackConversationId[]>
) {
  const db = getDb();
  const teamIds = db.userSlackInstallation.all.map((si) => si.team_id);

  assert(teamIds, "slack installation not defined for user");

  db.userSlackInstallation?.all.forEach(({ team_id: slack_workspace_id, id: user_slack_installation_id }) => {
    if (!slack_workspace_id) {
      log.error("Slack installation does not include team id");
      return;
    }

    const createdFiltersForTeam = db.userSlackChannelsByTeam.query({ slack_workspace_id }).all;

    if (createdFiltersForTeam.length === 0) {
      const included_channels = previouslyExistingSelected[slack_workspace_id] ?? [
        USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER,
      ];
      db.userSlackChannelsByTeam.create({
        slack_workspace_id,
        included_channels,
        user_slack_installation_id,
      });
    }
  });
}

export function transformPreviousChannelFilterIntoTeamChannelFilteringFormat(
  availableConversations: SlackConversationByTeam
) {
  const user = accountStore.assertUser;
  const previousFormatSelectedChannels = user.slack_included_channels as string[] | null;

  const previousFormatNeverIncludedSelectedChannels =
    !previousFormatSelectedChannels ||
    !Array.isArray(previousFormatSelectedChannels) ||
    previousFormatSelectedChannels.length === 0;

  if (previousFormatNeverIncludedSelectedChannels) {
    return {};
  }

  const hasUserAlreadyMigratedToNewFormat =
    Array.isArray(user.slack_included_channels) &&
    user.slack_included_channels.includes(USER_SLACK_CONVERSATIONS_MIGRATED_PLACEHOLDER);
  if (hasUserAlreadyMigratedToNewFormat) {
    return {};
  }

  const selectedConversationByTeamPreMigration: Record<SlackWorkspaceId, SlackConversationId[]> = {};

  /*
    user.slack_included_channels only includes is a SlackConversationIds[], i.e. string[].
    Since we want to divide filters by team, we need find which teams these user.slack_included_channels belong to
  */
  Object.keys(availableConversations).forEach((teamId) => {
    const previouslySelectedConversationsForThisTeam = availableConversations[teamId].filter(
      ({ id: slackConversationId }) => previousFormatSelectedChannels.includes(slackConversationId)
    );

    selectedConversationByTeamPreMigration[teamId] = previouslySelectedConversationsForThisTeam.map((c) => c.id);
  });

  return selectedConversationByTeamPreMigration;
}
