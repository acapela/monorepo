import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { exitSettings } from "@aca/desktop/actions/navigation";
import { AppLayout } from "@aca/desktop/layout/AppLayout";
import { appViewContainerStyles } from "@aca/desktop/layout/Container";
import { desktopRouter } from "@aca/desktop/routes";
import { IntegrationsManager } from "@aca/desktop/ui/IntegrationsManager";
import { UINavItem } from "@aca/desktop/ui/nav/NavItem";
import { SystemTopBar } from "@aca/desktop/ui/systemTopBar";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";
import { theme } from "@aca/ui/theme";

import { AccountSettings } from "./Account";
import { GeneralSettings } from "./General";
import { NotificationsSettings } from "./Notifications";

interface SettingsSection {
  id: string;
  label: string;
}

export const settingsSections: SettingsSection[] = [
  {
    id: "integrations",
    label: "Integrations",
  },
  {
    id: "general",
    label: "General",
  },
  {
    id: "account",
    label: "Account",
  },
  {
    id: "notifications",
    label: "Notifications",
  },
];

interface Props {
  sectionId: string;
}

export const SettingsView = observer(function SettingsView({ sectionId }: Props) {
  function goToSection(sectionId: string) {
    desktopRouter.navigate("settings", { section: sectionId });
  }
  return (
    <AppLayout>
      <SystemTopBar
        isFullWidth
        navigationItems={
          <>
            <TopBarActionButton action={exitSettings} />
          </>
        }
        titleNode="Settings"
      />
      <UIHolder>
        <UIBody>
          <UINav>
            <UIHeader key="settings-header">
              <UIHeaderMain>Settings</UIHeaderMain>
            </UIHeader>
            {settingsSections.map((section) => {
              return (
                <UINavItem
                  key={section.id}
                  $isActive={section.id === sectionId}
                  onClick={() => {
                    goToSection(section.id);
                  }}
                >
                  {section.label}
                </UINavItem>
              );
            })}
            <UIVersionInfo>
              v{window.electronBridge.env.version}
              {process.env.STAGE !== "production" ? ` (${process.env.STAGE})` : ""}
            </UIVersionInfo>
          </UINav>
          <UIActiveSection>
            {sectionId === "integrations" && <IntegrationsManager />}
            {sectionId === "general" && <GeneralSettings />}
            {sectionId === "notifications" && <NotificationsSettings />}
            {sectionId === "account" && <AccountSettings />}
          </UIActiveSection>
        </UIBody>
      </UIHolder>
    </AppLayout>
  );
});

const UIHolder = styled.div<{}>`
  ${appViewContainerStyles};
  display: flex;
  flex-direction: column;
  ${theme.layout.settingsPageMaxWidth}

  ${theme.spacing.pageSections.asGap}
  overflow: hidden;
`;

const UINav = styled.nav`
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 240px;
  flex-grow: 1;
  width: 100%;
`;

const UIBody = styled.div`
  display: flex;
  gap: 24px;
  overflow: auto;
`;

const UIActiveSection = styled.div`
  flex-grow: 1;
  overflow-y: auto;

  /* Visually appears at same heigh of first nav item */
  padding-top: 80px;
  padding-bottom: 80px;

  &::-webkit-scrollbar {
    width: 0 !important;
  }
`;

const UIHeader = styled.div<{}>`
  ${theme.typo.pageTitle.medium};
  padding-bottom: 24px;
`;

const UIHeaderMain = styled.div``;

const UIVersionInfo = styled.div`
  ${theme.typo.label};
  opacity: 0.3;
  margin-top: 16px;
  padding-left: 12px;
`;
