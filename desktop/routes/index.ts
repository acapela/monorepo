import { createRouter } from "react-chicane";

import { typedKeys } from "@aca/shared/object";

const routes = {
  home: "/",
  settings: "/settings",
  notification: "/notifications/:notificationId",
  focus: "/focus",
} as const;

export const allRouteNames = typedKeys(routes);

export const desktopRouter = createRouter(routes);
