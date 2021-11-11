import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styled from "styled-components";

import { TeamEntity } from "~frontend/clientdb/team";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import {
  DeleteSlackInstallationMutation,
  DeleteSlackInstallationMutationVariables,
  GetSlackInstallationUrlQuery,
  GetSlackInstallationUrlQueryVariables,
  TeamSlackInstallationSubscription,
  TeamSlackInstallationSubscriptionVariables,
} from "~gql";
import { assertDefined } from "~shared/assert";
import { isServer } from "~shared/isServer";
import { SLACK_INSTALL_ERROR_KEY, SLACK_WORKSPACE_ALREADY_USED_ERROR } from "~shared/slack";
import { Button } from "~ui/buttons/Button";
import { IconMinus } from "~ui/icons";
import { SlackLogo } from "~ui/icons/logos/SlackLogo";
import { addToast } from "~ui/toasts/data";

type Props = {
  team: TeamEntity;
};

export const AddSlackInstallationButton = observer(function AddSlackInstallationButton({
  teamId,
  label,
  tooltip,
  withBot,
}: {
  teamId: string;
  label?: string;
  tooltip?: string;
  withBot?: boolean;
}) {
  const { data: slackInstallationData, loading } = useQuery<
    GetSlackInstallationUrlQuery,
    GetSlackInstallationUrlQueryVariables
  >(
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

  const router = useRouter();
  useEffect(() => {
    // This shows an error toast if something went wrong during slack installation for the team.
    // Since the URL query part that holds the error is only ever added from the server, we do not need to listen to
    // further route changes.
    const query = { ...router.query };
    const slackInstallError = query[SLACK_INSTALL_ERROR_KEY];
    if (slackInstallError) {
      delete query[SLACK_INSTALL_ERROR_KEY];
      addToast({
        type: "error",
        title:
          slackInstallError == SLACK_WORKSPACE_ALREADY_USED_ERROR
            ? "The Slack workspace you chose is already used for a different Acapela team."
            : "An unknown error occured while trying to link your Slack workspace. We are looking into it!",
        timeout: 3000,
      });
      router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
    }
  }, [router]);

  return (
    <UISlackButton
      disabled={loading}
      onClick={() => {
        window.location.href = assertDefined(
          slackInstallationData?.slackInstallation,
          "should have slack installation"
        ).url;
      }}
      icon={<SlackLogo />}
      iconAtStart
      isWide
      tooltip={tooltip}
    >
      {loading ? "Loading..." : label ?? "Add Acapela to your Slack workspace"}
    </UISlackButton>
  );
});

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
      iconAtStart
      tooltip="Disable notifications and remove /acapela command on Slack"
    >
      Remove Acapela from your Slack workspace
    </UISlackButton>
  );
}

export const SlackInstallationButton = observer(function SlackInstallationButton({ team }: Props) {
  const { data } = useSubscription<TeamSlackInstallationSubscription, TeamSlackInstallationSubscriptionVariables>(
    gql`
      subscription TeamSlackInstallation($teamId: uuid!) {
        teamSlack: team_slack_installation_by_pk(team_id: $teamId) {
          id
        }
      }
    `,
    { variables: { teamId: team.id } }
  );
  if (!data) {
    return (
      <UISlackButton icon={<SlackLogo />} iconAtStart isWide disabled>
        Loading...
      </UISlackButton>
    );
  }
  if (!data.teamSlack) {
    return (
      <AddSlackInstallationButton
        teamId={team.id}
        tooltip="Enable your team to receive notifications and use /acapela command on Slack"
        withBot
      />
    );
  }

  if (!team.isOwnedByCurrentUser) {
    return null;
  }

  return <RemoveSlackInstallationButton teamId={team.id} />;
});

const UISlackButton = styled(Button)``;
