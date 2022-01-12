import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "@aca/frontend/authentication/useCurrentUser";
import { useDb } from "@aca/frontend/clientdb";
import { useCurrentTeam } from "@aca/frontend/team/CurrentTeam";
import { AddSlackInstallationButton } from "@aca/frontend/team/SlackInstallationButton";
import { checkHasAllSlackBotScopes, checkHasAllSlackUserScopes } from "@aca/shared/slack";
import { theme } from "@aca/ui/theme";

import { Panel } from "./ui";

export const SlackSettings = observer(() => {
  const currentUser = useAssertCurrentUser();

  const db = useDb();
  const team = useCurrentTeam();
  const teamMember = db.teamMember.query((teamMember) => teamMember.user_id == currentUser.id).first;

  const userScopes = toJS(teamMember?.teamMemberSlack?.slack_scopes) ?? [];
  const hasMissingScopes =
    !checkHasAllSlackUserScopes(userScopes ?? []) || !checkHasAllSlackBotScopes(team?.slackInstallation?.scopes ?? []);

  if (!team?.hasSlackInstallation || (teamMember?.teamMemberSlack && !hasMissingScopes)) {
    return null;
  }

  const needsRelinking = userScopes.length > 0 && hasMissingScopes;

  return (
    <Panel title="Slack" panelId="slack">
      {needsRelinking && (
        <UINoteParagraph>
          Note: You have linked your Slack account before but the permissions have changed. To use Acapela in Slack,
          please re-link your account below.
        </UINoteParagraph>
      )}

      <UIParagraph>With Slack linked to your Acapela you get these extra features:</UIParagraph>

      <UIList>
        <li>Receive notifications as direct messages (can also be turned off)</li>
        <li>
          Create requests directly from your Slack conversation with
          <UIList>
            <li>
              the <UICode>/acapela</UICode> command or
            </li>
            <li>
              through{" "}
              <UIExternalLink href="https://slack.com/help/articles/360057554553-Take-actions-quickly-from-the-shortcuts-menu-in-Slack">
                Slack's shortcuts
              </UIExternalLink>
            </li>
          </UIList>
        </li>
      </UIList>

      <AddSlackInstallationButton label={(needsRelinking ? "Re-" : "") + "Link your Slack account"} teamId={team.id} />
    </Panel>
  );
});

const UINoteParagraph = styled.span<{}>`
  ${theme.typo.content.medium.bold};
`;

const UIParagraph = styled.p<{}>`
  ${theme.typo.content.medium}
`;

const UIList = styled.ul<{}>`
  ${theme.typo.content.medium}
  list-style: circle inside;
  margin-left: 15px;
`;

const UICode = styled.code<{}>`
  padding: 3px;
  border-radius: 5px;
  ${theme.font.speziaMono};
  background: #f5f5f5;
`;

const UIExternalLink = styled.a<{}>`
  color: blue;
  text-decoration: underline;
`;
