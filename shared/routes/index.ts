import { parameterizeRoutes } from "~shared/routes/utils";

export const routes = parameterizeRoutes({
  home: "/",
  newRequest: "/new",
  // It is left here to support old links for a while. We should remove it ~end of 2021
  _deprecated_topic: ["/topic/[topicSlug]", ["topicSlug"]],
  topicByHandle: ["/[teamSlug]/topic/[topicSlug]/[topicId]", ["teamSlug", "topicSlug", "topicId"]],
  topicDuplicate: ["/[teamSlug]/topic/[topicSlug]/[topicId]/duplicate", ["teamSlug", "topicSlug", "topicId"]],
  settings: "/settings",
  invite: "/invite",
  logout: "/logout",
  login: "/login",
  teamCreate: "/team/create",
  teamInviteMembers: "/team/invite-members",
  teamSelect: "/team/select",
  teamSlack: "/team/slack",
} as const);
