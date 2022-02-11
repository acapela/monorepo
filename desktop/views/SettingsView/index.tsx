import { observer } from "mobx-react";
import React, { useState } from "react";
import styled from "styled-components";

import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { IntegrationsManager } from "@aca/desktop/ui/IntegrationsManager";
import { theme } from "@aca/ui/theme";

import { AccountSettings } from "./Account";
import { ExperimentalSettings } from "./Experimental";

interface SettingsSection {
  id: string;
  label: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: "integrations",
    label: "Integrations",
  },
  {
    id: "account",
    label: "Account",
  },
  {
    id: "experimental",
    label: "Experimental",
  },
];

export const SettingsView = observer(function SettingsView() {
  const [activeSection, setActiveSection] = useState(settingsSections[0]);
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
                  $isActive={section.id === activeSection.id}
                  onClick={() => {
                    setActiveSection(section);
                  }}
                >
                  {section.label}
                </UINavItem>
              );
            })}
          </UINav>
          <UIActiveSection>
            {activeSection.id === "integrations" && <IntegrationsManager />}
            {activeSection.id === "experimental" && <ExperimentalSettings />}
            {activeSection.id === "account" && <AccountSettings />}
          </UIActiveSection>
        </UIBody>
        <UIVersionInfo>
          v{window.electronBridge.env.version}
          {process.env.STAGE !== "production" ? ` (${process.env.STAGE})` : ""}
        </UIVersionInfo>
      </UIHolder>
    </TraySidebarLayout>
  );
});

const UIHolder = styled.div<{}>`
  padding: 26px 20px;

  display: flex;
  flex-direction: column;
  ${theme.layout.settingsPageMaxWidth}

  ${theme.spacing.pageSections.asGap}
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
`;

const UIActiveSection = styled.div`
  flex-grow: 1;
`;

const UIHeader = styled.div<{}>`
  ${theme.typo.pageTitle.semibold};
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap}
`;

const UIVersionInfo = styled.div`
  ${theme.typo.label.secondary.center};
`;

const UINavItem = styled.div<{ $isActive: boolean }>`
  ${theme.colors.layout.background.interactive};
  ${theme.transitions.hover("background-color")}
  ${theme.box.item}
  ${theme.radius.button}

  ${(props) => props.$isActive && theme.font.semibold}
`;
