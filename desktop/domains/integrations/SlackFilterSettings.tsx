import { subMinutes } from "date-fns";
import { computed, runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { getDb } from "@aca/desktop/clientdb";
import { accountStore } from "@aca/desktop/store/account";
import { querySlackConversations } from "@aca/desktop/ui/Filters/FilterEditorSlack";
import { SlackTeamConversationsDropdown } from "@aca/desktop/ui/Filters/SlackTeamConversationsDropdown";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { SlackConversationsQuery } from "@aca/gql";
import { assert } from "@aca/shared/assert";
import {
  USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER,
  USER_SLACK_CONVERSATIONS_MIGRATED_PLACEHOLDER,
} from "@aca/shared/slack";
import { VStack } from "@aca/ui/Stack";
import { Toggle } from "@aca/ui/toggle";

import { makeLogger } from "../dev/makeLogger";

const log = makeLogger("SlackGeneralConversationFilter");

type SlackWorkspaceId = string;
type SlackConversationId = string;
type SlackConversationByTeam = Record<SlackWorkspaceId, SlackConversationsQuery["slack_conversations"]>;

/*
  Hello! And welcome to this very complex component.

  This component is managing different crucial things:
  - Migrating user.slack_included_channels to user_slack_channels_by_team table
  - Ability to "Select all channels" in a team by adding a special placeholder
  - Ability to divide the slack channel filters by workspace

  ## Managing Migrations

  Migration starts right after the component is booted for the first time.
  After we migrate, user.slack_included_channels contents are replaced by `USER_SLACK_CONVERSATIONS_MIGRATED_PLACEHOLDER`
  The capturing phase of slack notifications also uses this placeholder to understand where
  to look for the corresponding filter.

  Note: I believe that `user.slack_included_channels` should be removed by June 2022.
  If you still find the migration code here and are reading this after the fact... you're it!

  ## Managing All Channel Selection

  When users toggle the "Select all channel", a USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER is added to the array.
  Important: The placeholder is always added to the array, and never replaces the array. This is
  meant to conserve the previous selected channels by the user.
*/
export const SlackChannelsByTeamFilters = observer(() => {
  const slackInstallations = accountStore.user?.slackInstallations;
  const user = accountStore.assertUser;
  const db = getDb();
  const userSlackChannelsByTeam = db.userSlackChannelsByTeam;

  const [availableSlackConversationsByTeam, setAvailableSlackConversationsByTeam] = useState<SlackConversationByTeam>(
    {}
  );
  const [timeOfLastUpdate, setTimeOfLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    async function startup() {
      runInAction(async () => {
        const availableConversations = await updateAvailableChannels();

        const selectedConversationByTeamPreMigration =
          transformPreviousChannelFilterIntoTeamChannelFilteringFormat(availableConversations);

        migrateToNewUserSlackChannelsFiltersByTeam(selectedConversationByTeamPreMigration);

        user.update({
          slack_included_channels: [USER_SLACK_CONVERSATIONS_MIGRATED_PLACEHOLDER],
        });
      });
    }
    startup();
  }, []);

  const selectedConversationsFilterByTeam: Record<SlackWorkspaceId, SlackConversationId[]> = computed(() => {
    const teamIds = slackInstallations?.all.map((si) => si.team_id);
    const result: Record<SlackWorkspaceId, SlackConversationId[]> = {};

    teamIds?.forEach((teamId) => {
      if (!teamId) {
        log.error("Slack installation does not include team id");
        return;
      }

      const storedSlackChannelsForTeam = userSlackChannelsByTeam.query({ slack_workspace_id: teamId }).first;

      if (!storedSlackChannelsForTeam) {
        // We expect this to be filled in later;
        return;
      }

      if (!Array.isArray(storedSlackChannelsForTeam.included_channels)) {
        log.error("slack included_channel filter not stored properly", storedSlackChannelsForTeam);
        return;
      }

      result[teamId] = storedSlackChannelsForTeam.included_channels ?? [];
    });

    return result;
  }).get();

  const allConversationsSelectedForTeamMap: Record<SlackConversationId, boolean> = computed(() => {
    return Object.keys(selectedConversationsFilterByTeam).reduce((acc, curr) => {
      return {
        [curr]: selectedConversationsFilterByTeam[curr].includes(USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER),
        ...acc,
      };
    }, {} as Record<SlackConversationId, boolean>);
  }).get();

  async function updateAvailableChannels() {
    const conversations = await querySlackConversations();
    const conversationsByTeams = conversations.reduce((acc, curr) => {
      if (!acc[curr.workspace_id]) {
        acc[curr.workspace_id] = [];
      }
      acc[curr.workspace_id].push(curr);
      return acc;
    }, {} as SlackConversationByTeam);

    setAvailableSlackConversationsByTeam(conversationsByTeams);

    return conversationsByTeams;
  }

  function migrateToNewUserSlackChannelsFiltersByTeam(
    previouslyExistingSelected: Record<SlackWorkspaceId, SlackConversationId[]>
  ) {
    const teamIds = slackInstallations?.all.map((si) => si.team_id);

    assert(teamIds, "slack installation not defined for user");

    teamIds.forEach((teamId) => {
      if (!teamId) {
        log.error("Slack installation does not include team id");
        return;
      }

      const createdFiltersForTeam = userSlackChannelsByTeam.query({ slack_workspace_id: teamId }).all;
      if (createdFiltersForTeam.length === 0) {
        const included_channels = previouslyExistingSelected[teamId] ?? [];
        userSlackChannelsByTeam.create({
          slack_workspace_id: teamId,
          included_channels,
        });
      }
    });
  }

  function transformPreviousChannelFilterIntoTeamChannelFilteringFormat(
    availableConversations: SlackConversationByTeam
  ) {
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

  // Done so that we don't over fetch the api, but still keep some updates
  async function handleDropdownOpen() {
    const threeMinutesAgo = subMinutes(new Date(), 3);

    if (timeOfLastUpdate.getTime() > threeMinutesAgo.getTime()) {
      await updateAvailableChannels();
      setTimeOfLastUpdate(new Date());
    }
  }

  function updateSelectedChannels(teamId: string, conversations: SlackConversationsQuery["slack_conversations"]) {
    const filter = userSlackChannelsByTeam.query({ slack_workspace_id: teamId }).first;

    assert(filter, "filter should have been created");

    const included_channels = conversations.map((c) => c.id);

    filter.update({
      included_channels,
    });
  }

  function handlePickAllChannelsForTeam(teamId: string, setIncludeAllChannels: boolean) {
    const teamChannelFilter = db.userSlackChannelsByTeam.query({ user_id: user.id, slack_workspace_id: teamId }).first;

    assert(teamChannelFilter, "team channel filter must be created");

    assert(Array.isArray(teamChannelFilter.included_channels), "included channels must be array");

    /*
      We always keep the previously included_channels when we add/remove the USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER
      This is just so the user doesn't lose their specific channel selection if they mistakenly played
      around with setting the "Select All Channels" filter
    */
    const included_channels = setIncludeAllChannels
      ? [...teamChannelFilter.included_channels, USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER]
      : teamChannelFilter.included_channels.filter((c) => c !== USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER);

    teamChannelFilter.update({
      included_channels,
    });
  }

  if (!slackInstallations) {
    return <></>;
  }

  return (
    <>
      {slackInstallations.all.map(({ team_id, team_name }) => {
        if (!team_id) {
          return <></>;
        }

        const selectedChannels = selectedConversationsFilterByTeam[team_id];

        if (selectedChannels === null || selectedChannels === undefined) {
          return <></>;
        }

        const areAllConversationsAllowed = allConversationsSelectedForTeamMap[team_id] ?? false;
        const availableConversations = availableSlackConversationsByTeam[team_id] ?? [];

        return (
          <VStack gap={16} key={team_id}>
            {/* This slackInstallations.count > 1 is not a bug. Please ping @omar if you feel like refactoring */}
            {slackInstallations.count > 1 && <UITitle>{team_name} Notification Configuration</UITitle>}
            <VStack gap={8}>
              <SettingRow
                title="Include All Channels"
                description={`Messages from all channels in ${team_name} workspace will turn into notifications.`}
              >
                <Toggle
                  isDisabled
                  isSet={areAllConversationsAllowed}
                  onChange={(isSet) => handlePickAllChannelsForTeam(team_id, isSet)}
                />
              </SettingRow>
            </VStack>

            <VStack gap={8}>
              <SettingRow
                title="Include Specific channels"
                description="Messages in these channels will turn into notifications."
              >
                <UISlackTeamConversationsDropdown
                  placeholder={areAllConversationsAllowed ? "All channels selected" : "Select specific channels"}
                  isDisabled={areAllConversationsAllowed}
                  handleDropdownOpen={handleDropdownOpen}
                  conversations={areAllConversationsAllowed ? [] : availableConversations}
                  checkSelected={(id) => selectedChannels.includes(id)}
                  onChange={(channels) => {
                    updateSelectedChannels(team_id, channels);
                  }}
                />
              </SettingRow>
            </VStack>
          </VStack>
        );
      })}
    </>
  );
});

const UITitle = styled.h2<{}>`
  padding-top: 20px;
  width: 100%;
`;

const UISlackTeamConversationsDropdown = styled(SlackTeamConversationsDropdown)`
  max-width: 200px;
`;
