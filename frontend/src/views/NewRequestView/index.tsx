import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { theme } from "~ui/theme";

import { CurrentTeamMembersManager } from "../SettingsView/TeamMembersManager";
import { NewRequest } from "./NewRequest";

export const NewRequestView = observer(function NewRequestView() {
  const db = useDb();
  const user = useCurrentUserTokenData();
  const hasTeamMembers = db.teamMember.all.length > 1;

  return (
    <UIHolder>
      {hasTeamMembers && (
        <ClientSideOnly>
          <NewRequest />
        </ClientSideOnly>
      )}
      {/* TODO: Temporary. Get new designs and integrate with onboarding flow */}
      {!hasTeamMembers && (
        <UIInviteNewMembersSection>
          <UIInviteNewMembersTitle>Hi {user?.name} 👋</UIInviteNewMembersTitle>
          Please invite new team members to Acapela or integrate with slack.
          <CurrentTeamMembersManager />
        </UIInviteNewMembersSection>
      )}
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UIInviteNewMembersSection = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 24px;
`;

const UIInviteNewMembersTitle = styled.h1<{}>`
  ${theme.font.h2.build()}
`;
