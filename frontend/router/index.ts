import { useRouter } from "next/router";

import { createRoute } from "./create";

export { RouteLink } from "./RouteLink";

export const routes = {
  home: createRoute("/", {}),
  team: createRoute("/team", {}),
  logout: createRoute("/logout", {}),
  topic: createRoute("/topics/:topicId", { topicId: "string" }),

  // <likely-to-be-deprecated>
  spaces: createRoute("/spaces", {}),
  calendar: createRoute("/calendar", {}),
  space: createRoute("/space/[spaceId]", { spaceId: "string" }),

  spaceRoom: createRoute("/space/[spaceId]/[roomId]", { spaceId: "string", roomId: "string" }),
  spaceRoomSummary: createRoute("/space/[spaceId]/[roomId]/summary", { spaceId: "string", roomId: "string" }),
  spaceRoomTopic: createRoute("/space/[spaceId]/[roomId]/[topicId]", {
    spaceId: "string",
    roomId: "string",
    topicId: "string",
  }),
  // </likely-to-be-deprecated>

  invitePage: createRoute("/invites/[inviteCode]", { inviteCode: "string" }),
};

export function useIsAnyRouteActive(paths: Array<string>) {
  // We use router only to re-render this hook each time router path changes.
  const router = useRouter();
  return paths.some((path) => {
    return router.pathname === path;
  });
}

export function useIsRoutePathActive(path: string) {
  const router = useRouter();

  return router.pathname === path;
}
