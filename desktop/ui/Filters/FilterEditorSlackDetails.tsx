import { observer } from "mobx-react";
import React from "react";
import styled, { css } from "styled-components";

import { slackIntegrationClient } from "@aca/desktop/domains/integrations/slack";
import { getSlackConversations, getSlackUsers } from "@aca/desktop/domains/slack/conversations";
import { SlackConversationsQuery } from "@aca/gql";
import { ValueUpdater, updateValue } from "@aca/shared/updateValue";
import { MultipleOptionsDropdown } from "@aca/ui/forms/OptionsDropdown/multiple";
import { IconComment2Text, IconHashtagCircle, IconUsers } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";
import { Toggle } from "@aca/ui/toggle";

import { ServiceUsersFilterRow } from "./ServiceUsersFilterRow";
import { ParsedSlackFilter, compileSlackFilter, parseSlackFilter } from "./slackModel";
import { NotificationFilterKind } from "./types";
import { FilterSettingRow, getWorkspaceLabel } from "./utils";

type SlackFilter = NotificationFilterKind<"notification_slack_message">;
interface Props {
  filter: SlackFilter;
  onChange: (filter: SlackFilter) => void;
}

export const SlackConversationsDropdown = observer(
  ({
    checkSelected,
    onChange,

    className,
    placeholder,
  }: {
    checkSelected: (id: string) => boolean;
    onChange: (conversations: SlackConversationsQuery["slack_conversations"]) => void;

    className?: string;
    placeholder?: string;
  }) => {
    const slackConversations = getSlackConversations();

    return (
      <MultipleOptionsDropdown<typeof slackConversations[number]>
        className={className}
        placeholder={placeholder ?? "All"}
        items={slackConversations}
        keyGetter={(channel) => channel.id}
        labelGetter={(channel) =>
          (channel.is_private ? "🔒" : "#") +
          channel.name +
          getWorkspaceLabel(slackIntegrationClient, channel.workspace_id)
        }
        selectedItems={slackConversations.filter(({ id }) => checkSelected(id))}
        onChange={onChange}
      />
    );
  }
);
export const FilterEditorSlackDetails = observer(({ filter, onChange }: Props) => {
  const slackUsers = getSlackUsers();

  const parsedFilter = parseSlackFilter(filter);

  const { anyMessages, directMessages, mentions } = parsedFilter;

  function update(updater: ValueUpdater<ParsedSlackFilter>) {
    const newParsedFilter = updateValue(parsedFilter, updater);
    const newRawFilters = compileSlackFilter(newParsedFilter);

    newRawFilters.__typename === "notification_slack_message";
    if (filter.id) {
      newRawFilters.id = filter.id;
    }

    onChange(newRawFilters);
  }

  function getSlackUsersByIds(ids: string[]) {
    return slackUsers.filter((slackUser) => ids.includes(slackUser.id));
  }

  return (
    <UIHolder>
      <UIGroup>
        <FilterSettingRow title="Direct messages" icon={<IconUsers />}>
          <Toggle
            isSet={!!directMessages}
            onChange={(isSelected) => {
              update((filter) => {
                if (!isSelected) {
                  delete filter.directMessages;
                } else {
                  filter.directMessages = { type: "everyone" };
                }
              });
            }}
          />
        </FilterSettingRow>

        {directMessages && (
          <>
            <UISegmented>
              <UISegment
                $isActive={directMessages.type === "everyone"}
                onClick={() => {
                  update((filter) => {
                    filter.directMessages = { type: "everyone" };
                  });
                }}
              >
                Everyone
              </UISegment>
              <UISegment
                $isActive={directMessages.type === "selectedPeople"}
                onClick={() => {
                  update((filter) => {
                    filter.directMessages = { type: "selectedPeople", selectedPeople: [] };
                  });
                }}
              >
                Select people
              </UISegment>
              <UISegment
                $isActive={directMessages.type === "excludedPeople"}
                onClick={() => {
                  update((filter) => {
                    filter.directMessages = { type: "excludedPeople", excludedPeople: [] };
                  });
                }}
              >
                Everyone except
              </UISegment>
            </UISegmented>
            {directMessages.type === "excludedPeople" && (
              <UIIndent>
                <ServiceUsersFilterRow
                  label="Exclude people"
                  integrationClient={slackIntegrationClient}
                  users={slackUsers}
                  selectedUsers={getSlackUsersByIds(directMessages.excludedPeople)}
                  onChange={(users) => {
                    update((filter) => {
                      filter.directMessages = {
                        type: "excludedPeople",
                        excludedPeople: users.map((u) => u.id),
                      };
                    });
                  }}
                />
              </UIIndent>
            )}
            {directMessages.type === "selectedPeople" && (
              <UIIndent>
                <ServiceUsersFilterRow
                  label="Select people"
                  integrationClient={slackIntegrationClient}
                  users={slackUsers}
                  selectedUsers={getSlackUsersByIds(directMessages.selectedPeople)}
                  onChange={(users) => {
                    update((filter) => {
                      filter.directMessages = {
                        type: "selectedPeople",
                        selectedPeople: users.map((u) => u.id),
                      };
                    });
                  }}
                />
              </UIIndent>
            )}
          </>
        )}
      </UIGroup>

      <UILimiter />

      <UIGroup>
        <FilterSettingRow title="Mentions" icon={<IconHashtagCircle />}>
          <Toggle
            isSet={!!mentions}
            onChange={(isSelected) => {
              update((filter) => {
                if (isSelected) {
                  filter.mentions = { type: "everyChannel" };
                } else {
                  delete filter.mentions;
                }
              });
            }}
          />
        </FilterSettingRow>

        {mentions && (
          <>
            <UISegmented>
              <UISegment
                $isActive={mentions.type === "everyChannel"}
                onClick={() => {
                  update((filter) => {
                    filter.mentions = { type: "everyChannel" };
                  });
                }}
              >
                All channels
              </UISegment>
              <UISegment
                $isActive={mentions.type === "selectedChannels"}
                onClick={() => {
                  update((filter) => {
                    filter.mentions = { type: "selectedChannels", selectedChannels: [] };
                  });
                }}
              >
                Select channels
              </UISegment>
              <UISegment
                $isActive={mentions.type === "excludedChannels"}
                onClick={() => {
                  update((filter) => {
                    filter.mentions = { type: "excludedChannels", excludedChannels: [] };
                  });
                }}
              >
                All channels except
              </UISegment>
            </UISegmented>
            {mentions.type === "selectedChannels" && (
              <UIIndent>
                <FilterSettingRow title="Select channels">
                  <SlackConversationsDropdown
                    placeholder="None"
                    checkSelected={(id) => mentions.selectedChannels.includes(id)}
                    onChange={(channels) => {
                      update((filter) => {
                        filter.mentions = {
                          type: "selectedChannels",
                          selectedChannels: channels.map((c) => c.id),
                        };
                      });
                    }}
                  />
                </FilterSettingRow>
              </UIIndent>
            )}
            {mentions.type === "excludedChannels" && (
              <UIIndent>
                <FilterSettingRow title="Exclude channels">
                  <SlackConversationsDropdown
                    placeholder="None"
                    checkSelected={(id) => mentions.excludedChannels.includes(id)}
                    onChange={(channels) => {
                      update((filter) => {
                        filter.mentions = {
                          type: "excludedChannels",
                          excludedChannels: channels.map((c) => c.id),
                        };
                      });
                    }}
                  />
                </FilterSettingRow>
              </UIIndent>
            )}
          </>
        )}
      </UIGroup>

      <UILimiter />

      <UIGroup>
        <FilterSettingRow title="Other messages" icon={<IconComment2Text />}>
          <Toggle
            isSet={!!anyMessages}
            onChange={(isSelected) => {
              update((filter) => {
                if (isSelected) {
                  filter.anyMessages = { channels: [] };
                } else {
                  delete filter.anyMessages;
                }
              });
            }}
          />
        </FilterSettingRow>

        {!!anyMessages && (
          <UIIndent>
            <FilterSettingRow
              title="Any message in channel"
              description="Will include every message, even if you're not mentioned."
            >
              <SlackConversationsDropdown
                placeholder="Select channels..."
                checkSelected={(id) => anyMessages.channels.includes(id)}
                onChange={(channels) => {
                  update((filter) => {
                    filter.anyMessages!.channels = channels.map((c) => c.id);
                  });
                }}
              />
            </FilterSettingRow>
          </UIIndent>
        )}
      </UIGroup>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 400px;
  max-width: 400px;
`;

const UILimiter = styled.div`
  height: 2px;
  ${theme.colors.layout.divider.asBg}
`;

const UIGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UIIndent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  padding-top: 12px;
`;

const UISegmented = styled.div`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  ${theme.colors.layout.backgroundAccent.hover.withBorder.asBgWithReadableText};
`;

const UISegment = styled.div<{ $isActive?: boolean }>`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  padding: 8px 4px;

  ${theme.transitions.hover()}

  ${(props) => {
    if (props.$isActive) return theme.colors.primary.asBgWithReadableText;

    return css`
      ${theme.colors.layout.backgroundAccent.hover.interactive}
      ${theme.colors.text.asColor};
    `;
  }}

  ${theme.typo.bodyTitle}

  &:not(:last-child) {
    border-right: 1px solid ${theme.colors.layout.divider.value};
  }
`;
