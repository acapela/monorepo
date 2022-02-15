import assert from "assert";

import { Draft } from "immer";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { NotificationFilter } from "@aca/desktop/clientdb/notification/list";
import { useSlackUsers } from "@aca/desktop/domains/slack/useSlackUsers";
import { typedKeys } from "@aca/shared/object";
import { Button } from "@aca/ui/buttons/Button";
import { SingleOptionDropdown } from "@aca/ui/forms/OptionsDropdown/single";
import { VStack } from "@aca/ui/Stack";
import { theme } from "@aca/ui/theme";

import { IntegrationFilterFormProps } from "./shared";

const OPTIONS = {
  all: { label: "All messages", data: {} },
  onlyMentions: { label: "Only mentions", data: { is_mention: true } },
  noMentions: { label: "All messages except mentions", data: { is_mention: false } },
};

export const SlackFilterForm = observer(({ filters, produceFiltersUpdate }: IntegrationFilterFormProps) => {
  const slackUsers = useSlackUsers();

  const produceFilterUpdate = (
    i: number,
    fn: (filter: Draft<Extract<NotificationFilter, { __typename: "notification_slack_message" }>>) => void
  ) =>
    produceFiltersUpdate((filters) => {
      const filter = filters[i];
      assert(filter.__typename == "notification_slack_message", `invalid filter kind ${filter.__typename} at ${i}`);
      fn(filter);
    });

  return (
    <>
      {filters.map((filter, i) => {
        if (filter.__typename !== "notification_slack_message") {
          return null;
        }
        return (
          <UIVStack key={i} gap={8}>
            <SingleOptionDropdown<keyof typeof OPTIONS>
              items={typedKeys(OPTIONS)}
              keyGetter={(key) => key}
              labelGetter={(key) => OPTIONS[key].label}
              selectedItem={filter.is_mention === undefined ? "all" : filter.is_mention ? "onlyMentions" : "noMentions"}
              onChange={(selected) => {
                produceFilterUpdate(i, (filter) => {
                  const optionData = OPTIONS[selected].data;
                  if ("is_mention" in optionData) {
                    filter.is_mention = optionData.is_mention;
                  } else {
                    delete filter.is_mention;
                  }
                });
              }}
            />
            <UISpacedText>{" from "}</UISpacedText>
            <SingleOptionDropdown
              items={slackUsers}
              keyGetter={(user) => user.id}
              labelGetter={(user) => user.real_name ?? user.display_name}
              selectedItem={slackUsers.find((user) => user.id === filter.slack_user_id)}
              onChange={(selected) =>
                produceFilterUpdate(i, (filter) => {
                  filter.slack_user_id = selected.id;
                })
              }
              placeholder="Everyone"
            />
            <Button
              kind="primarySubtle"
              onClick={() => {
                produceFiltersUpdate((filters) => {
                  delete filters[i];
                });
              }}
            >
              Delete
            </Button>
          </UIVStack>
        );
      })}
      <br />
      <Button
        onClick={() =>
          produceFiltersUpdate((filters) => {
            filters.push({ __typename: "notification_slack_message" });
          })
        }
      >
        Add Slack Filter
      </Button>
    </>
  );
});

const UIVStack = styled(VStack)`
  border-bottom: 1px solid ${theme.colors.layout.divider.value};
  padding: 8px 0;
`;

const UISpacedText = styled.div`
  padding: 0 16px;
`;
