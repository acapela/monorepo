import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { useCurrentTeam } from "~frontend/team/CurrentTeam";
import { AddSlackInstallationButton } from "~frontend/team/SlackInstallationButton";
import { checkHasAllSlackUserScopes } from "~shared/slack";
import { theme } from "~ui/theme";

export const SlackSettings = observer(() => {
  const currentUser = useAssertCurrentUser();

  const db = useDb();
  const team = useCurrentTeam();
  const teamMember = db.teamMember.query((teamMember) => teamMember.user_id == currentUser.id).first;

  const userScopes = toJS(teamMember?.teamMemberSlack?.slack_scopes) ?? [];
  const hasMissingScopes = !checkHasAllSlackUserScopes(userScopes ?? []);

  if (!team?.hasSlackInstallation || (teamMember?.teamMemberSlack && !hasMissingScopes)) {
    return null;
  }

  const needsRelinking = userScopes.length > 0 && hasMissingScopes;

  return (
    <UIPanel>
      <UITitle>Slack</UITitle>

      {needsRelinking && (
        <UIParagraph>
          <UINote>Note:</UINote> You have linked your Slack account before but the permissions have changed. To use
          Acapela in Slack, please re-link your account below.
        </UIParagraph>
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

const UIParagraph = styled.p<{}>`
  ${theme.typo.content.medium}
`;

const UINote = styled.span<{}>`
  ${theme.typo.content.medium.semibold};
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
