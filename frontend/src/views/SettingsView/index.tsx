import React from "react";
import styled from "styled-components";

import { SidebarLayout } from "~frontend/layouts/SidebarLayout";

import { NotificationSettings } from "./NotificationSettings";
import { CurrentTeamMembersManager } from "./TeamMembersManager";

const appVersion = process.env.NEXT_PUBLIC_SENTRY_RELEASE;
const appBuildDate = process.env.NEXT_PUBLIC_BUILD_DATE;

export function SettingsView() {
  return (
    <SidebarLayout>
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
    </SidebarLayout>
  );
}

const UIHolder = styled.div<{}>``;

const UIHeader = styled.div<{}>``;
