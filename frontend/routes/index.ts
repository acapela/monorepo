import { useRouter } from "next/router";
import { createRoute } from "./create";

export const routes = {
  home: createRoute("/", {}),
  team: createRoute("/team", {}),
  logout: createRoute("/logout", {}),
  spaces: createRoute("/spaces", {}),
  space: createRoute("/space/[spaceId]", { spaceId: "string" }),

  spaceRoom: createRoute("/space/[spaceId]/[roomId]", { spaceId: "string", roomId: "string" }),
  spaceRoomTopic: createRoute("/space/[spaceId]/[roomId]/[topicId]", {
    spaceId: "string",
    roomId: "string",
    topicId: "string",
  }),
  invitePage: createRoute("/invite/[inviteCode]", { inviteCode: "string" }),
};

export function useIsAnyRouteActive(routeNames: Array<keyof typeof routes>) {
  // We use router only to re-render this hook each time router path changes.
  const router = useRouter();
  return routeNames.some((routeName) => {
    return routes[routeName].isActive(router);
  });
}
