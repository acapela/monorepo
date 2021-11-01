import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { useCurrentTeam } from "~frontend/team/CurrentTeam";
import { AddSlackInstallationButton } from "~frontend/team/SlackInstallationButton";
import { theme } from "~ui/theme";

export const SlackSettings = observer(() => {
  const currentUser = useAssertCurrentUser();

  const db = useDb();
  const team = useCurrentTeam();
  const teamMember = db.teamMember.query((teamMember) => teamMember.user_id == currentUser.id).all[0];

  if (!team || !teamMember || !team.hasSlackInstallation || teamMember.teamMemberSlack) {
    return null;
  }

  return (
    <UIPanel>
      <UITitle>Slack</UITitle>

      <Paragraph>
        With Slack linked to your Acapela you get these extra features:
        <List>
          <li>Receive notifications as direct messages (can also be turned off)</li>
          <li>
            Create requests directly from your Slack conversation with
            <List>
              <li>
                the <Code>/acapela</Code> command or
              </li>
              <li>
                through{" "}
                <ExternalLink href="https://slack.com/help/articles/360057554553-Take-actions-quickly-from-the-shortcuts-menu-in-Slack">
                  Slack's shortcuts
                </ExternalLink>
              </li>
            </List>
          </li>
        </List>
      </Paragraph>

      <AddSlackInstallationButton label="Link your Slack account" teamId={team.id} />
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

const Paragraph = styled.p<{}>`
  ${theme.typo.content.medium}
`;

const List = styled.ul<{}>`
  list-style: circle inside;
  margin-left: 15px;
`;

const Code = styled.code<{}>`
  padding: 3px;
  border-radius: 5px;
  ${theme.font.speziaMono};
  background: #f5f5f5;
`;

const ExternalLink = styled.a<{}>`
  color: blue;
  text-decoration: underline;
`;
