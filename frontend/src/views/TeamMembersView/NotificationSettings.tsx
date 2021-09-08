import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import {
  TeamMemberNotifyQuery,
  TeamMemberNotifyQueryVariables,
  UpdateTeamMemberMutation,
  UpdateTeamMemberMutationVariables,
} from "~gql";
import { assertDefined } from "~shared/assert";
import { theme } from "~ui/theme";
import { Toggle } from "~ui/toggle";

const getNotificationChannelDescription = (channel: string) =>
  `Mentions and room invitations will be sent via ${channel}.`;

const LabeledToggle = ({
  title,
  description,
  isSet,
  onChange,
  isDisabled,
  tooltip,
}: {
  title: string;
  description: string;
  isSet: boolean;
  onChange: (isChecked: boolean) => void;
  isDisabled?: boolean;
  tooltip?: string;
}) => (
  <UILabel data-tooltip={tooltip}>
    <div>
      {title}
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

export function NotificationSettings() {
  const currentTeamId = useCurrentTeamId();
  const teamId = assertDefined(currentTeamId, "must have team ID");
  const currentUser = useAssertCurrentUser();

  const { data } = useQuery<TeamMemberNotifyQuery, TeamMemberNotifyQueryVariables>(
    gql`
      query TeamMemberNotify($teamId: uuid!, $userId: uuid!) {
        teamMember: team_member(where: { team_id: { _eq: $teamId }, user_id: { _eq: $userId } }) {
          id
          user_id
          team_id
          notify_email
          notify_slack
          team {
            id
            slack_installation {
              team_id
            }
          }
        }
      }
    `,
    {
      variables: { teamId, userId: currentUser.id },
    }
  );
  const teamMember = data?.teamMember[0];

  const [updateTeamMember] = useMutation<UpdateTeamMemberMutation, UpdateTeamMemberMutationVariables>(
    gql`
      mutation UpdateTeamMember($teamId: uuid!, $userId: uuid!, $notify_email: Boolean!, $notify_slack: Boolean!) {
        update_team_member(
          where: { team_id: { _eq: $teamId }, user_id: { _eq: $userId } }
          _set: { notify_email: $notify_email, notify_slack: $notify_slack }
        ) {
          returning {
            id
            notify_email
            notify_slack
          }
        }
      }
    `,
    {
      optimisticResponse: (vars) => ({
        __typename: "mutation_root",
        update_team_member: {
          __typename: "team_member_mutation_response",
          returning: [{ __typename: "team_member", id: teamMember?.id || "??", ...vars }],
        },
      }),
    }
  );

  if (!teamMember) {
    return null;
  }

  const handleUpdate = (data: Partial<UpdateTeamMemberMutationVariables>) => {
    updateTeamMember({ variables: { teamId, userId: currentUser.id, ...teamMember, ...data } });
  };

  const hasSlackInstallation = Boolean(teamMember.team.slack_installation);

  return (
    <UIPanel>
      <UITitle>Notifications</UITitle>

      <LabeledToggle
        title="Email"
        description={getNotificationChannelDescription("email")}
        isSet={teamMember.notify_email}
        onChange={(isChecked) => handleUpdate({ notify_email: isChecked })}
      />
      <LabeledToggle
        title="Slack"
        description={getNotificationChannelDescription("slack")}
        isSet={teamMember.notify_slack}
        onChange={(isChecked) => handleUpdate({ notify_slack: isChecked })}
        isDisabled={!hasSlackInstallation}
        tooltip={hasSlackInstallation ? undefined : "Slack has not been installed for your team"}
      />
    </UIPanel>
  );
}

const UIPanel = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px;

  background: ${theme.colors.layout.foreground()};
  ${theme.borderRadius.modal};
  ${theme.shadow.popover}

  width: 534px;
  @media (max-width: 560px) {
    width: 100%;
  }
`;

const UITitle = styled.h3<{}>`
  ${theme.font.h3.spezia.build()};
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
  ${theme.font.body12.build()};
  color: ${theme.colors.layout.supportingText()};
`;
