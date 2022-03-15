import { toggleFocusModeStats, toggleShowShortcutsBar } from "@aca/desktop/actions/settings";
import React from "react";

import { ActionSystemMenuItem } from "./ActionSystemMenuItem";
import { SystemMenuItem } from "./SystemMenuItem";

export function SystemMenuManager() {
  return (
    <>
      <ActionSystemMenuItem action={toggleShowShortcutsBar} path={["View"]} />
      <ActionSystemMenuItem action={toggleShowShortcutsBar} path={["View"]} />
      <ActionSystemMenuItem action={toggleFocusModeStats} path={["View"]} />
    </>
  );
}
