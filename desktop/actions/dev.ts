import { restartAppRequest } from "@aca/desktop/bridge/system";
import { devSettingsStore } from "@aca/desktop/domains/dev/store";

import { defineAction } from "./action";
import { defineGroup } from "./action/group";

export const devActionsGroup = defineGroup({
  name: "Developer",
});

export const restartElectronAction = defineAction({
  name: "Restart app",
  group: devActionsGroup,
  shortcut: ["Mod", "Shift", "D"],
  keywords: ["dev", "reload"],
  handler() {
    restartAppRequest();
  },
});

export const toggleDebugFocus = defineAction({
  name: "Toggle debug focus",
  group: devActionsGroup,
  keywords: ["dev"],
  supplementaryLabel: () => (devSettingsStore.debugFocus ? "Will disable" : "Will enable"),
  handler() {
    devSettingsStore.debugFocus = !devSettingsStore.debugFocus;
  },
});
