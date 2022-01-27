import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useCurrentTeam } from "@aca/desktop/auth/CurrentTeam";
import { useAssertCurrentUser } from "@aca/desktop/auth/useCurrentUser";
import {
  figmaAuthTokenBridgeValue,
  googleAuthTokenBridgeValue,
  loginFigmaBridge,
  loginGoogleBridge,
  loginNotionBridge,
  loginSlackBridge,
  notionAuthTokenBridgeValue,
  slackAuthTokenBridgeValue,
} from "@aca/desktop/bridge/auth";
import { useDb } from "@aca/desktop/clientdb/ClientDbProvider";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { Button } from "@aca/ui/buttons/Button";
import { HStack } from "@aca/ui/Stack";
import { theme } from "@aca/ui/theme";

import { CreateTeamForm } from "./CreateTeamForm";
import { InstallSlackButton } from "./InstallSlackButton";

export const SettingsView = observer(function SettingsView() {
  const db = useDb();
  const team = useCurrentTeam();
  const currentUser = useAssertCurrentUser();
  const teamMember = db.teamMember.query((teamMember) => teamMember.user_id == currentUser.id).first;

  const isNotionAuthorized = !!notionAuthTokenBridgeValue.use();
  const isFigmaAuthorized = !!figmaAuthTokenBridgeValue.use();
  const isGoogleAuthorized = googleAuthTokenBridgeValue.use();
  const isSlackAuthorized = !!slackAuthTokenBridgeValue.use();

  return (
    <TraySidebarLayout>
      <UIHolder>
        <UIHeader>Settings</UIHeader>
        {!team && <CreateTeamForm />}

        {!isNotionAuthorized && <Button onClick={() => loginNotionBridge()}>Connect Notion</Button>}
        {isNotionAuthorized && <div>Notion authorized</div>}

        {!isFigmaAuthorized && <Button onClick={() => loginFigmaBridge()}>Connect Figma</Button>}
        {isFigmaAuthorized && <div>Figma authorized</div>}

        {!isGoogleAuthorized && <Button onClick={() => loginGoogleBridge()}>Connect Google</Button>}
        {isGoogleAuthorized && <div>Google authorized</div>}

        {!isSlackAuthorized && <Button onClick={() => loginSlackBridge()}>Connect Slack</Button>}
        {isSlackAuthorized && (
          <HStack alignItems="center" gap={10}>
            <div>Slack authorized</div>
            {!teamMember?.teamMemberSlack && (
              <>{team ? <InstallSlackButton teamId={team.id} /> : <div>Create a team to connect Slack</div>}</>
            )}
          </HStack>
        )}
        <UIVersionInfo>dev</UIVersionInfo>
      </UIHolder>
    </TraySidebarLayout>
  );
});

const UIHolder = styled.div<{}>`
  padding: 26px 20px;

  display: flex;
  flex-direction: column;

  ${theme.spacing.pageSections.asGap}
`;

const UIHeader = styled.div<{}>`
  ${theme.typo.pageTitle};
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap}
`;

const UIVersionInfo = styled.div`
  ${theme.typo.label.secondary.center};
`;
