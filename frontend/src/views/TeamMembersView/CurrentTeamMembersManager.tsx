import { gql } from "@apollo/client";
import styled from "styled-components";
import { assertDefined } from "~shared/assert";
import { removeTeamMember, useCurrentTeamDetails, removeTeamInvitation } from "~frontend/gql/teams";
import { createMutation, createQuery } from "~frontend/gql/utils";
import { UISelectGridContainer } from "~frontend/ui/MembersManager/UISelectGridContainer";
import { UserBasicInfo } from "~frontend/ui/users/UserBasicInfo";
import {
  DeleteSlackInstallationMutation,
  DeleteSlackInstallationMutationVariables,
  GetSlackInstallationUrlQuery,
  GetSlackInstallationUrlQueryVariables,
} from "~gql";
import { InviteMemberForm } from "./InviteMemberForm";
import { InvitationPendingIndicator } from "~frontend/ui/MembersManager/InvitationPendingIndicator";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";
import { Button } from "~ui/buttons/Button";
import { IconMinus, IconPlus } from "~ui/icons";
import { theme } from "~ui/theme";
import { ExitTeamButton } from "./ExitTeamButton";
import { ResendInviteButton } from "./ResendInviteButton";
import { addToast } from "~ui/toasts/data";
import { openConfirmPrompt } from "~frontend/utils/confirm";

const [useGetSlackInstallationURL] = createQuery<GetSlackInstallationUrlQuery, GetSlackInstallationUrlQueryVariables>(
  () => gql`
    query GetSlackInstallationURL($input: GetTeamSlackInstallationURLInput!) {
      get_team_slack_installation_url(input: $input) {
        url
      }
    }
  `
);

const [useDeleteSlackInstallation] = createMutation<
  DeleteSlackInstallationMutation,
  DeleteSlackInstallationMutationVariables
>(
  () => gql`
    mutation DeleteSlackInstallation($teamId: uuid!) {
      delete_single_team_slack_installation(args: { from_team_id: $teamId }) {
        id
        has_slack_installation
      }
    }
  `
);

export const CurrentTeamMembersManager = () => {
  const [team] = useCurrentTeamDetails();
  const currentUser = useAssertCurrentUser();
  const isCurrentUserTeamOwner = currentUser.id === team?.owner_id;

  const [deleteSlackInstallation, { loading: isDeleteingSlackInstallation }] = useDeleteSlackInstallation({});
  const isServer = typeof window == "undefined";
  const [slackInstallation] = useGetSlackInstallationURL(
    {
      input: { teamId: team?.id ?? "", redirectURL: isServer ? "" : location.href },
    },
    { skip: isServer || !isCurrentUserTeamOwner || !!team.has_slack_installation }
  );

  if (!team) {
    return null;
  }

  const teamMembers = team.memberships.map((membership) => membership.user) ?? [];
  const teamMembersEmails = new Set(teamMembers.map(({ email }) => email));

  const handleRemoveTeamMember = (userId: string) => {
    removeTeamMember({ userId, teamId: team.id });
  };

  const invitations = team.invitations ?? [];
  const pendingInvitations = invitations.filter(({ email }) => !teamMembersEmails.has(email));

  const handleRemoveInvitation = (invitationId: string) => {
    removeTeamInvitation({ id: invitationId });
  };

  return (
    <UIPanel>
      <UIHeader>
        <UITitle>{team.name} members</UITitle>
        <ExitTeamButton />
      </UIHeader>
      {isCurrentUserTeamOwner && (
        <div>
          {team.has_slack_installation ? (
            <Button
              disabled={isDeleteingSlackInstallation}
              onClick={async () => {
                const didConfirm = await openConfirmPrompt({
                  title: "Disable Slack Integration",
                  description: "Are you sure you want to disable Slack integration for notifications?",
                  confirmLabel: "Disable",
                });
                if (!didConfirm) {
                  return;
                }
                await deleteSlackInstallation({ teamId: team.id });
                addToast({ type: "info", content: "Slack installation was disabled" });
              }}
              icon={<IconMinus />}
              iconPosition="start"
              tooltip="Disable notifications through slack"
            >
              Remove Slack integration
            </Button>
          ) : (
            <Button
              onClick={() => {
                window.location.href = assertDefined(slackInstallation, "should have slack installation").url;
              }}
              icon={<IconPlus />}
              iconPosition="start"
              tooltip="Enable your team to receive notifications through Slack"
            >
              Add Slack integration
            </Button>
          )}
        </div>
      )}
      <InviteMemberForm />
      {teamMembers.length > 0 && (
        <UISelectGridContainer>
          {teamMembers.map((user) => (
            <UIItemHolder key={user.id}>
              <UserBasicInfo user={user} />
              {!(user.id === team.owner_id) && (
                <CircleCloseIconButton
                  isDisabled={!isCurrentUserTeamOwner}
                  onClick={() => handleRemoveTeamMember(user.id)}
                  tooltip={isCurrentUserTeamOwner ? undefined : "Only team owner can delete members"}
                />
              )}
            </UIItemHolder>
          ))}
          {pendingInvitations.map(({ email, id }) => (
            <UIItemHolder key={id}>
              <InvitationPendingIndicator email={email} />
              <UIActionsHolder>
                <ResendInviteButton invitationId={id} />
                <CircleCloseIconButton
                  isDisabled={!isCurrentUserTeamOwner}
                  onClick={() => handleRemoveInvitation(id)}
                  tooltip={!isCurrentUserTeamOwner ? "Only team owner can delete invitations" : undefined}
                />
              </UIActionsHolder>
            </UIItemHolder>
          ))}
        </UISelectGridContainer>
      )}
    </UIPanel>
  );
};

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

const UIHeader = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 4px;
`;

const UITitle = styled.h3<{}>`
  ${theme.font.h3.spezia.build()};
`;

const UIItemHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
`;

const UIActionsHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
