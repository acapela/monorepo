import { parameterizeRoutes } from "~shared/routes/utils";

export const routes = parameterizeRoutes({
  home: "/",
  newRequest: "/new",
  topicByHandle: ["/[teamSlug]/[topicSlug]/[topicId]", ["teamSlug", "topicSlug", "topicId"]],
  topicDuplicate: ["/[teamSlug]/[topicSlug]/[topicId]/duplicate", ["teamSlug", "topicSlug", "topicId"]],
  settings: "/settings",
  invite: "/invite",
  logout: "/logout",
  login: "/login",
  teamCreate: "/team/create",
  teamInviteMembers: "/team/invite-members",
  teamSelect: "/team/select",
  teamSlack: "/team/slack",
  finishLogInInApp: "/app/return-to-app",
  loginForDesktop: "/app/login",
} as const);
