import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { exitSettings } from "@aca/desktop/actions/navigation";
import { desktopRouter } from "@aca/desktop/routes";
import { IntegrationsManager } from "@aca/desktop/ui/IntegrationsManager";
import { UINavItem } from "@aca/desktop/ui/nav/NavItem";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";
import { theme } from "@aca/ui/theme";

import { AccountSettings } from "./Account";
import { GeneralSettings } from "./General";
import { NotificationsSettings } from "./Notifications";
import { SettingsLayout } from "./shared";

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
    <SettingsLayout
      topBarNavigationItems={<TopBarActionButton action={exitSettings} />}
      topBarTitle="Settings"
      headerTitle="Settings"
      navItems={
        <>
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
        </>
      }
      body={
        <>
          {sectionId === "integrations" && <IntegrationsManager />}
          {sectionId === "general" && <GeneralSettings />}
          {sectionId === "notifications" && <NotificationsSettings />}
          {sectionId === "account" && <AccountSettings />}
        </>
      }
    />
  );
});

const UIVersionInfo = styled.div`
  ${theme.typo.label};
  opacity: 0.3;
  margin-top: 16px;
  padding-left: 12px;
`;
