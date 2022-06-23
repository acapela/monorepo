import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { AppLayout } from "@aca/desktop/layout/AppLayout";
import { appViewContainerStyles } from "@aca/desktop/layout/Container";
import { SystemTopBar } from "@aca/desktop/ui/systemTopBar";
import { theme } from "@aca/ui/theme";

interface Props {
  topBarNavigationItems?: ReactNode;
  isUserMenuIncluded?: boolean;
  topBarTitle?: string;
  headerTitle?: string;
  navItems?: ReactNode;
  body?: ReactNode;
}

export const SettingsLayout = observer(function SettingsLayout({
  topBarNavigationItems,
  topBarTitle,
  headerTitle,
  navItems,
  body,
  isUserMenuIncluded = true,
}: Props) {
  return (
    <AppLayout>
      <SystemTopBar
        isFullWidth
        isUserMenuIncluded={isUserMenuIncluded}
        navigationItems={topBarNavigationItems}
        titleNode={topBarTitle}
      />
      <UIHolder>
        <UIBody>
          <UINav>
            {headerTitle && (
              <UIHeader key="settings-header">
                <UIHeaderMain>{headerTitle}</UIHeaderMain>
              </UIHeader>
            )}
            {navItems}
          </UINav>
          <UIActiveSection>{body}</UIActiveSection>
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
  margin-top: 80px;
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
