import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";

import { TeamEntity } from "@aca/frontend/clientdb/team";
import { openConfirmPrompt } from "@aca/frontend/utils/confirm";
import {
  GetSlackInstallationUrlQuery,
  GetSlackInstallationUrlQueryVariables,
  TeamSlackInstallationSubscription,
  TeamSlackInstallationSubscriptionVariables,
  UninstallSlackMutation,
  UninstallSlackMutationVariables,
} from "@aca/gql";
import { assertDefined } from "@aca/shared/assert";
import { isServer } from "@aca/shared/isServer";
import { SLACK_INSTALL_ERROR_KEY, SLACK_WORKSPACE_ALREADY_USED_ERROR } from "@aca/shared/slack";
import { Button } from "@aca/ui/buttons/Button";
import { IconMinus } from "@aca/ui/icons";
import { SlackLogo } from "@aca/ui/icons/logos/SlackLogo";
import { addToast } from "@aca/ui/toasts/data";

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
      isDisabled={loading}
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
  const [uninstallSlack, { data, loading }] = useMutation<UninstallSlackMutation, UninstallSlackMutationVariables>(
    gql`
      mutation UninstallSlack($teamId: uuid!) {
        uninstall_slack(team_id: $teamId) {
          success
        }
      }
    `
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
    await uninstallSlack({ variables: { teamId } });
  };

  if (loading || data?.uninstall_slack.success) {
    return <SlackLoadingButton>Waiting for Slack to uninstall Acapela from your workspace</SlackLoadingButton>;
  }

  return (
    <UISlackButton
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

  const hasTeamSlackInstallationRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (!data) {
      return;
    }
    const hasTeamSlackInstallation = !!data.teamSlack;
    if (hasTeamSlackInstallationRef.current && !hasTeamSlackInstallation) {
      addToast({ type: "success", title: "Slack has been uninstalled from your workspace" });
    }
    hasTeamSlackInstallationRef.current = hasTeamSlackInstallation;
  }, [data]);

  if (!data) {
    return <SlackLoadingButton>Loading...</SlackLoadingButton>;
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

const UISlackButton = styled(Button)`
  ${(props) =>
    props.isDisabled &&
    css`
      opacity: 0.6;
      cursor: initial;
    `}
`;

const SlackLoadingButton = (props: React.ComponentProps<typeof UISlackButton>) => (
  <UISlackButton icon={<SlackLogo />} iconAtStart isWide isDisabled {...props} />
);
