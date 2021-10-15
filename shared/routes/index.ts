import { parameterizeRoutes } from "~shared/routes/utils";

export const routes = parameterizeRoutes({
  home: "/",
  newRequest: "/new",
  topic: ["/topic/[topicSlug]", ["topicSlug"]],
  settings: "/settings",
  invite: "/invite",
  logout: "/logout",
} as const);
