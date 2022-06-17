import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { exitSettings } from "@aca/desktop/actions/navigation";
import { devSettingsStore } from "@aca/desktop/domains/dev/store";
import { desktopRouter } from "@aca/desktop/routes";
import { IntegrationsManager } from "@aca/desktop/ui/IntegrationsManager";
import { UINavItem } from "@aca/desktop/ui/nav/NavItem";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";
import { theme } from "@aca/ui/theme";

import { AccountSettings } from "./Account";
import { DevSettings } from "./Dev";
import { GeneralSettings } from "./General";
import { NotificationsSettings } from "./Notifications";
import { ReferralsView } from "./Referrals";
import { SettingsLayout } from "./shared";
import { SubscriptionView } from "./Subscription";

interface SettingsSection {
  label: string;
  component: React.ComponentType;
  isHidden?: boolean;
}

export const settingsSections: Record<string, SettingsSection> = {
  integrations: {
    label: "Integrations",
    component: IntegrationsManager,
  },
  subscription: {
    label: "Subscription",
    component: SubscriptionView,
  },
  general: {
    label: "General",
    component: GeneralSettings,
  },
  account: {
    label: "Account",
    component: AccountSettings,
  },
  notifications: {
    label: "Notifications",
    component: NotificationsSettings,
  },
  referrals: {
    label: "Referrals",
    component: ReferralsView,
  },
  dev: {
    label: "Dev",
    component: DevSettings,
    get isHidden() {
      return !devSettingsStore.devMode;
    },
  },
};

interface Props {
  sectionId: string;
}

export const SettingsView = observer(function SettingsView({ sectionId }: Props) {
  function goToSection(sectionId: string) {
    desktopRouter.navigate("settings", { section: sectionId });
  }

  const SettingsComponent = sectionId in settingsSections ? settingsSections[sectionId].component : React.Fragment;
  return (
    <SettingsLayout
      topBarNavigationItems={<TopBarActionButton action={exitSettings} />}
      topBarTitle="Settings"
      headerTitle="Settings"
      navItems={
        <>
          {Object.entries(settingsSections)
            .filter(([, { isHidden }]) => !isHidden)
            .map(([id, { label }]) => {
              return (
                <UINavItem
                  key={id}
                  $isActive={id === sectionId}
                  onClick={() => {
                    goToSection(id);
                  }}
                >
                  {label}
                </UINavItem>
              );
            })}
          <UIVersionInfo>
            v{window.electronBridge.env.version}
            {process.env.STAGE !== "production" ? ` (${process.env.STAGE})` : ""}
          </UIVersionInfo>
        </>
      }
      body={<SettingsComponent />}
    />
  );
});

const UIVersionInfo = styled.div`
  ${theme.typo.label};
  opacity: 0.3;
  position: absolute;
  bottom: 24px;
  left: 24px;
`;
