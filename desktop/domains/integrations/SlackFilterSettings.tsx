import { subMinutes } from "date-fns";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { getDb } from "@aca/desktop/clientdb";
import { userSlackChannelsByTeamEntity } from "@aca/desktop/clientdb/userSlackChannelsByTeam";
import { accountStore } from "@aca/desktop/store/account";
import { SlackTeamConversationsDropdown } from "@aca/desktop/ui/Filters/SlackTeamConversationsDropdown";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { SlackConversationsQuery } from "@aca/gql";
import { assert } from "@aca/shared/assert";
import { VStack } from "@aca/ui/Stack";
import { Toggle } from "@aca/ui/toggle";

import { getSlackConversations } from "../slack/conversations";

// Uncomment if needed
// import { makeLogger } from "../dev/makeLogger";
// const log = makeLogger("SlackGeneralConversationFilter");

export type SlackWorkspaceId = string;
export type SlackConversationId = string;
export type SlackConversationByTeam = Record<SlackWorkspaceId, SlackConversationsQuery["slack_conversations"]>;

/*
  Hello! And welcome to this not-so-complex-anymore component.

  This component is managing 2 crucial things:
  - Ability to manage channel filters for a team
  - Ability to divide the slack channel filters by workspace
*/
export const SlackChannelsByTeamFilters = observer(() => {
  const slackInstallations = accountStore.user?.slackInstallations;
  const user = accountStore.assertUser;
  const db = getDb();
  const userSlackChannelsByTeam = db.entity(userSlackChannelsByTeamEntity);

  const [availableSlackConversationsByTeam, setAvailableSlackConversationsByTeam] = useState<SlackConversationByTeam>(
    {}
  );
  const [timeOfLastUpdate, setTimeOfLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    runInAction(async () => {
      await updateAvailableChannels();
    });
  }, []);

  async function updateAvailableChannels() {
    const conversations = await getSlackConversations();
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

  // Done so that we don't over fetch the api, but still keep some updates
  async function handleDropdownOpen() {
    const threeMinutesAgo = subMinutes(new Date(), 3);

    if (timeOfLastUpdate.getTime() > threeMinutesAgo.getTime()) {
      await updateAvailableChannels();
      setTimeOfLastUpdate(new Date());
    }
  }

  // Set 'included_channels'/'excluded_channels' channels depending on the current value for 'are_all_channels_included'
  function updateFilterChannels(teamId: string, conversations: SlackConversationsQuery["slack_conversations"]) {
    const filter = userSlackChannelsByTeam.findFirst({ slack_workspace_id: teamId });

    assert(filter, "filter should have been created");

    const selectedChannels = conversations.map((c) => c.id);

    filter.are_all_channels_included
      ? filter.update({
          excluded_channels: selectedChannels,
        })
      : filter.update({
          included_channels: selectedChannels,
        });
  }

  function handleToggleAllChannelsIncludedForTeam(teamId: string, setIncludeAllChannels: boolean) {
    const teamChannelFilter = db
      .entity(userSlackChannelsByTeamEntity)
      .findFirst({ user_id: user.id, slack_workspace_id: teamId });

    assert(teamChannelFilter, "team channel filter must be created");

    assert(Array.isArray(teamChannelFilter.included_channels), "included channels must be array");

    teamChannelFilter.update({ are_all_channels_included: setIncludeAllChannels });
  }

  if (!slackInstallations) {
    return <></>;
  }

  return (
    <>
      {slackInstallations.all.map(({ id: user_slack_installation_id, team_id, team_name }) => {
        if (!team_id) {
          return <></>;
        }

        const availableChannels = availableSlackConversationsByTeam[team_id] ?? [];
        const channelFilter = userSlackChannelsByTeam.findFirst({ user_slack_installation_id });

        if (!channelFilter) {
          return <></>;
        }

        const areBotsEnabled = !!channelFilter.are_bots_enabled;
        const areAllChannelsIncluded = channelFilter.are_all_channels_included ?? true;
        const selectedChannels = channelFilter.are_all_channels_included
          ? channelFilter.excluded_channels
          : channelFilter?.included_channels;

        return (
          <VStack gap={16} key={team_id}>
            {/* This slackInstallations.count > 1 is not a bug. Please ping @omar if you feel like refactoring */}
            {slackInstallations.count > 1 && <UITitle>{team_name} Notification Configuration</UITitle>}
            <VStack gap={8}>
              <SettingRow
                title="Include Messages from Apps and Bots"
                description="Messages from apps like Google Calendar, Asana, or Github will turn into notifications."
              >
                <Toggle
                  isDisabled
                  isSet={areBotsEnabled}
                  onChange={(are_bots_enabled) => channelFilter?.update({ are_bots_enabled })}
                />
              </SettingRow>
            </VStack>
            <VStack gap={8}>
              <SettingRow
                title="Include All Channels"
                description={`Messages from all channels in ${team_name} workspace will turn into notifications.`}
              >
                <Toggle
                  isDisabled
                  isSet={areAllChannelsIncluded}
                  onChange={(isSet) => handleToggleAllChannelsIncludedForTeam(team_id, isSet)}
                />
              </SettingRow>
            </VStack>

            <VStack gap={8}>
              <SettingRow
                title={`${areAllChannelsIncluded ? "Exclude" : "Include"} Specific channels`}
                description={`Messages in these channels ${
                  areAllChannelsIncluded ? "won't" : "will"
                } turn into notifications.`}
              >
                <UISlackTeamConversationsDropdown
                  placeholder="Select specific channels"
                  handleDropdownOpen={handleDropdownOpen}
                  conversations={availableChannels}
                  checkSelected={(id) => selectedChannels.includes(id)}
                  onChange={(channels) => {
                    updateFilterChannels(team_id, channels);
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
