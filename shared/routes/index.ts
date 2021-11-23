import { parameterizeRoutes } from "~shared/routes/utils";

export const routes = parameterizeRoutes({
  home: "/",
  newRequest: "/new",
  topic: ["/topic/[topicSlug]", ["topicSlug"]],
  topicDuplicate: ["/topic/[topicSlug]/duplicate", ["topicSlug"]],
  settings: "/settings",
  invite: "/invite",
  logout: "/logout",
  login: "/login",
  teamCreate: "/team/create",
  teamInviteMembers: "/team/invite-members",
  teamSelect: "/team/select",
  teamSlack: "/team/slack",
} as const);
