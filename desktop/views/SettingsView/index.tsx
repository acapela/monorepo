import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { desktopRouter } from "@aca/desktop/routes";
import { IntegrationsManager } from "@aca/desktop/ui/IntegrationsManager";
import { theme } from "@aca/ui/theme";

import { AccountSettings } from "./Account";
import { ExperimentalSettings } from "./Experimental";
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
  {
    id: "experimental",
    label: "Experimental",
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
    <TraySidebarLayout>
      <UIHolder>
        <UIHeader>Settings</UIHeader>

        <UIBody>
          <UINav>
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
          </UINav>
          <UIActiveSection>
            {sectionId === "integrations" && <IntegrationsManager />}
            {sectionId === "general" && <GeneralSettings />}
            {sectionId === "experimental" && <ExperimentalSettings />}
            {sectionId === "notifications" && <NotificationsSettings />}
            {sectionId === "account" && <AccountSettings />}
            <UIVersionInfo>
              v{window.electronBridge.env.version}
              {process.env.STAGE !== "production" ? ` (${process.env.STAGE})` : ""}
            </UIVersionInfo>
          </UIActiveSection>
        </UIBody>
      </UIHolder>
    </TraySidebarLayout>
  );
});

const UIHolder = styled.div<{}>`
  padding: 0 20px;

  display: flex;
  flex-direction: column;
  ${theme.layout.settingsPageMaxWidth}

  ${theme.spacing.pageSections.asGap}
  overflow: hidden;
`;

const UINav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

  &::-webkit-scrollbar {
    width: 0 !important;
  }
`;

const UIHeader = styled.div<{}>`
  ${theme.typo.pageTitle.semibold};
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap}
`;

const UIVersionInfo = styled.div`
  ${theme.typo.label.secondary.center};
  margin-top: 24px;
`;

const UINavItem = styled.div<{ $isActive: boolean }>`
  ${theme.colors.layout.background.interactive};
  ${theme.transitions.hover("background-color")}
  ${theme.box.item}
  ${theme.radius.button}

  ${(props) => props.$isActive && theme.font.semibold}
`;
