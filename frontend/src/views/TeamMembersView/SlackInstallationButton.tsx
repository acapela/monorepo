import { gql, useMutation, useQuery } from "@apollo/client";
import styled from "styled-components";

import { EntityByDefinition } from "~clientdb";
import { teamEntity } from "~frontend/clientdb/team";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import {
  DeleteSlackInstallationMutation,
  DeleteSlackInstallationMutationVariables,
  GetSlackInstallationUrlQuery,
  GetSlackInstallationUrlQueryVariables,
} from "~gql";
import { assertDefined } from "~shared/assert";
import { isServer } from "~shared/isServer";
import { Button } from "~ui/buttons/Button";
import { IconMinus, IconPlus } from "~ui/icons";
import { addToast } from "~ui/toasts/data";

type Props = {
  team: EntityByDefinition<typeof teamEntity>;
  isCurrentUserTeamOwner: boolean;
};

export function AddSlackInstallationButton({
  teamId,
  tooltip,
  withBot,
}: {
  teamId: string;
  tooltip: string;
  withBot?: boolean;
}) {
  const { data: slackInstallationData } = useQuery<GetSlackInstallationUrlQuery, GetSlackInstallationUrlQueryVariables>(
    gql`
      query GetSlackInstallationURL($input: GetTeamSlackInstallationURLInput!) {
        slackInstallation: get_team_slack_installation_url(input: $input) {
          url
        }
      }
    `,
    {
      skip: isServer,
      variables: { input: { team_id: teamId, with_bot: !!withBot, redirectURL: isServer ? "" : location.href } },
    }
  );

  return (
    <UISlackButton
      onClick={() => {
        window.location.href = assertDefined(
          slackInstallationData?.slackInstallation,
          "should have slack installation"
        ).url;
      }}
      icon={<IconPlus />}
      iconPosition="start"
      tooltip={tooltip}
    >
      Add Slack integration
    </UISlackButton>
  );
}

function RemoveSlackInstallationButton({ teamId }: { teamId: string }) {
  const [deleteSlackInstallation, { loading: isDeletingSlackInstallation }] = useMutation<
    DeleteSlackInstallationMutation,
    DeleteSlackInstallationMutationVariables
  >(
    gql`
      mutation DeleteSlackInstallation($teamId: uuid!) {
        slack_installation: delete_team_slack_installation_by_pk(team_id: $teamId) {
          team_id
        }
      }
    `,
    {
      optimisticResponse: () => ({ __typename: "mutation_root", slack_installation: null }),
      update(cache) {
        cache.modify({
          id: cache.identify({ __typename: "team", id: teamId }),
          fields: { slack_installation: () => null },
        });
      },
    }
  );

  const handleClickDisableSlack = async () => {
    const didConfirm = await openConfirmPrompt({
      title: "Disable Slack Integration",
      description: "Are you sure you want to disable Slack integration for notifications?",
      confirmLabel: "Disable",
    });
    if (!didConfirm) {
      return;
    }
    await deleteSlackInstallation({ variables: { teamId } });
    addToast({ type: "success", title: "Slack installation was disabled" });
  };

  return (
    <UISlackButton
      disabled={isDeletingSlackInstallation}
      onClick={handleClickDisableSlack}
      icon={<IconMinus />}
      iconPosition="start"
      tooltip="Disable notifications through slack"
    >
      Remove Slack integration
    </UISlackButton>
  );
}

export function SlackInstallationButton({ team, isCurrentUserTeamOwner }: Props) {
  if (team.hasSlackInstallation) {
    return isCurrentUserTeamOwner ? <RemoveSlackInstallationButton teamId={team.id} /> : null;
  } else {
    return (
      <AddSlackInstallationButton
        teamId={team.id}
        tooltip="Enable your team to receive notifications through Slack"
        withBot
      />
    );
  }
}

const UISlackButton = styled(Button)`
  width: fit-content;
`;
