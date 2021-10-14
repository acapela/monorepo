import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { DropFileContext } from "~richEditor/DropFileContext";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { theme } from "~ui/theme";

import { CurrentTeamMembersManager } from "../SettingsView/TeamMembersManager";
import { NewRequest } from "./NewRequest";

export const NewRequestView = observer(function NewRequestView() {
  const db = useDb();
  const userToken = useCurrentUserTokenData();
  const user = userToken && db.user.findById(userToken.id);
  const hasTeamMembers = db.teamMember.all.length > 1;

  return (
    <>
      {hasTeamMembers && (
        <UIDropFileHolder>
          <ClientSideOnly>
            <NewRequest />
          </ClientSideOnly>
        </UIDropFileHolder>
      )}
      {/* TODO: Temporary. Get new designs and integrate with onboarding flow */}
      {!hasTeamMembers && (
        <UIHolder>
          <UIInviteNewMembersSection>
            <UIInviteNewMembersTitle>Hi {user?.name} 👋</UIInviteNewMembersTitle>
            To begin using Acapela, please invite new team members or integrate with slack.
            <CurrentTeamMembersManager />
          </UIInviteNewMembersSection>
        </UIHolder>
      )}
    </>
  );
});

const UIInviteNewMembersSection = styled.div<{}>`
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 32px;
`;

const UIInviteNewMembersTitle = styled.h1<{}>`
  ${theme.typo.pageTitle}
`;

const UIDropFileHolder = styled(DropFileContext)<{}>`
  height: 100%;
  width: 100%;
`;

const UIHolder = styled.div<{}>`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
