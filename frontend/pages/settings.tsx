import React from "react";
import styled from "styled-components";

import { SidebarLayout } from "~frontend/layouts/SidebarLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { PageMeta } from "~frontend/utils/PageMeta";
import { SettingsView } from "~frontend/views/SettingsView";

import { AppConfig } from "./_app";

export default function SettingsPage(props: { appConfig: AppConfig }) {
  return (
    <>
      <PageMeta title="Settings" />
      <UIHolder>
        <SettingsView version={props.appConfig.version} buildDate={props.appConfig.buildDate} />
      </UIHolder>
    </>
  );
}

assignPageLayout(SettingsPage, SidebarLayout);

const UIHolder = styled.div`
  max-width: 1200px;
  width: 100%;
  align-self: center;
`;
