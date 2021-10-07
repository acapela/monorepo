import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { SidebarLayout } from "~frontend/layouts/SidebarLayout";
import { useCurrentTeam } from "~frontend/team/useCurrentTeamId";

import { NotificationSettings } from "./NotificationSettings";
import { CurrentTeamMembersManager } from "./TeamMembersManager";

const appVersion = process.env.NEXT_PUBLIC_SENTRY_RELEASE;
const appBuildDate = process.env.NEXT_PUBLIC_BUILD_DATE;

export const SettingsView = observer(function SettingsView() {
  const team = useCurrentTeam();

  return (
    <SidebarLayout>
      {!team && <>Loading...</>}
      {team && (
        <UIHolder>
          <UIHeader>Settings</UIHeader>
          <NotificationSettings />
          <CurrentTeamMembersManager />

          {appVersion && (
            <div>
              Version: {appVersion} ({appBuildDate})
            </div>
          )}
        </UIHolder>
      )}
    </SidebarLayout>
  );
});

const UIHolder = styled.div<{}>`
  padding: 26px 20px;

  display: flex;
  flex-direction: column;

  gap: 16px;
`;

const UIHeader = styled.div<{}>``;
