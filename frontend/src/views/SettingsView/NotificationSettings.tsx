import { gql, useQuery } from "@apollo/client";
import { noop } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { useCurrentTeam } from "~frontend/team/CurrentTeam";
import { SlackUserQuery, SlackUserQueryVariables } from "~gql";
import { theme } from "~ui/theme";
import { Toggle } from "~ui/toggle";

import { TeamMemberWorkHoursSettings } from "./TeamMemberWorkHoursSettings";
import { Panel } from "./ui";

const getNotificationChannelDescription = (channel: string) => `Receive personal notifications via ${channel}.`;

const LabeledToggle = ({
  title,
  description,
  isSet,
  onChange,
  isDisabled,
}: {
  title: string;
  description: string;
  isSet: boolean;
  onChange: (isChecked: boolean) => void;
  isDisabled?: boolean;
}) => (
  <UILabel>
    <div>
      <UILabeledToggleTitle>{title}</UILabeledToggleTitle>
      <UIByline>{description}</UIByline>
    </div>
    <Toggle
      size="small"
      isSet={isSet}
      isDisabled={isDisabled}
      onSet={() => onChange(true)}
      onUnset={() => onChange(false)}
    />
  </UILabel>
);

const UILabeledToggleTitle = styled.div`
  ${theme.typo.content.bold};
`;

export const NotificationSettings = observer(() => {
  const currentUser = useAssertCurrentUser();

  const db = useDb();
  const team = useCurrentTeam();
  const teamMember = db.teamMember.query((teamMember) => teamMember.user_id == currentUser.id).first;

  const { data, loading: isLoadingSlackUser } = useQuery<SlackUserQuery, SlackUserQueryVariables>(
    gql`
      query SlackUser($teamId: uuid!) {
        slackUser: slack_user(team_id: $teamId) {
          slackUserId: slack_user_id
        }
      }
    `,
    team && teamMember && !teamMember.teamMemberSlack ? { variables: { teamId: team.id } } : { skip: true }
  );

  if (!team || !teamMember) {
    return null;
  }

  return (
    <Panel title="Notifications">
      <LabeledToggle
        title="Email"
        description={getNotificationChannelDescription("email")}
        isSet={teamMember.notify_email}
        onChange={(isChecked) => teamMember.update({ notify_email: isChecked })}
      />
      {team.hasSlackInstallation &&
        (isLoadingSlackUser ? (
          <LabeledToggle
            key="slack"
            title="Slack"
            description="Looking for a slack user with your email address..."
            isSet={false}
            onChange={noop}
            isDisabled
          />
        ) : (
          (teamMember.teamMemberSlack || data?.slackUser?.slackUserId) && (
            <LabeledToggle
              key="slack"
              title="Slack"
              description={getNotificationChannelDescription("slack")}
              isSet={teamMember.notify_slack}
              onChange={(isChecked) => teamMember.update({ notify_slack: isChecked })}
            />
          )
        ))}
      <TeamMemberWorkHoursSettings />
    </Panel>
  );
});

const UILabel = styled.label<{}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  cursor: pointer;
`;

const UIByline = styled.div<{}>`
  margin-top: 4px;
  ${theme.typo.label.secondary};
`;
