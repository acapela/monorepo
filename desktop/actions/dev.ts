import { restartAppRequest } from "@aca/desktop/bridge/system";

import { defineAction } from "./action";
import { defineGroup } from "./action/group";

export const devActionsGroup = defineGroup({
  name: "Developer",
});

export const restartElectronAction = defineAction({
  name: "Restart electron app",
  group: devActionsGroup,
  shortcut: ["Mod", "Shift", "D"],
  keywords: ["dev", "reload"],
  handler() {
    restartAppRequest();
  },
});
