import { observer } from "mobx-react-lite";
import React from "react";

import { forceNotificationsSync } from "@aca/desktop/actions/app";
import { logOut } from "@aca/desktop/actions/auth";
import { goToSettings } from "@aca/desktop/actions/navigation";
import { toggleFocusModeStats, toggleShowShortcutsBar } from "@aca/desktop/actions/settings";
import { uiSettingsBridge } from "@aca/desktop/bridge/ui";
import { typedKeys } from "@aca/shared/object";

import { ActionSystemMenuItem } from "./ActionSystemMenuItem";
import { SystemMenuItem } from "./SystemMenuItem";

const THEME_LABELS = {
  auto: "Sync with system",
  dark: "Dark",
  light: "Light",
};

export const SystemMenuManager = observer(function SystemMenuManager() {
  const themeCurrentSetting = uiSettingsBridge.get().theme;

  const appName = window.electronBridge.env.appName;
  return (
    <>
      <ActionSystemMenuItem action={toggleShowShortcutsBar} path={["View"]} />
      <ActionSystemMenuItem action={toggleFocusModeStats} path={["View"]} />
      <ActionSystemMenuItem action={forceNotificationsSync} path={["View"]} />
      <ActionSystemMenuItem action={logOut} path={[appName, "Account"]} />
      <ActionSystemMenuItem action={goToSettings} path={[appName, "Preferences"]} />
      {typedKeys(THEME_LABELS).map((themeValue) => {
        return (
          <SystemMenuItem
            group="dark-mode"
            key={themeValue}
            label={THEME_LABELS[themeValue]}
            path={["View", "Dark Mode"]}
            isChecked={themeCurrentSetting === themeValue}
            onClicked={() => {
              uiSettingsBridge.update({ theme: themeValue });
            }}
          />
        );
      })}
    </>
  );
});
