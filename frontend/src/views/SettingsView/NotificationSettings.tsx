import { gql, useQuery } from "@apollo/client";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { useCurrentTeam } from "~frontend/team/useCurrentTeamId";
import { FindSlackUserQuery, FindSlackUserQueryVariables } from "~gql";
import { theme } from "~ui/theme";
import { Toggle } from "~ui/toggle";

import { AddSlackInstallationButton } from "./TeamMembersManager/SlackInstallationButton";

const getNotificationChannelDescription = (channel: string) => `Requests will be sent via ${channel}.`;

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
  const teamMember = db.teamMember.query((teamMember) => teamMember.user_id == currentUser.id).all[0];

  const { data } = useQuery<FindSlackUserQuery, FindSlackUserQueryVariables>(
    gql`
      query FindSlackUser($teamId: uuid!) {
        findSlackUserOutput: find_slack_user(input: { team_id: $teamId }) {
          has_slack_user
        }
      }
    `,
    team ? { variables: { teamId: team.id } } : { skip: true }
  );

  if (!team || !teamMember || !data) {
    return null;
  }

  const hasSlackUser = Boolean(data.findSlackUserOutput?.has_slack_user);

  return (
    <UIPanel>
      <UITitle>Notifications</UITitle>

      <LabeledToggle
        title="Email"
        description={getNotificationChannelDescription("email")}
        isSet={teamMember.notify_email}
        onChange={(isChecked) => teamMember.update({ notify_email: isChecked })}
      />
      {team.hasSlackInstallation && hasSlackUser && (
        <LabeledToggle
          title="Slack"
          description={getNotificationChannelDescription("slack")}
          isSet={teamMember.notify_slack}
          onChange={(isChecked) => teamMember.update({ notify_slack: isChecked })}
        />
      )}

      {team.hasSlackInstallation && !hasSlackUser && (
        <AddSlackInstallationButton teamId={team.id} tooltip="Connect Slack to receive notifications through it" />
      )}
    </UIPanel>
  );
});

const UIPanel = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px;

  ${theme.colors.layout.background.withBorder.asBg};
  ${theme.radius.primaryItem};

  width: 100%;
`;

const UITitle = styled.h3<{}>`
  ${theme.typo.secondaryTitle};
`;

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
