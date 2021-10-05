import { useRouter } from "next/router";

import { createRoute } from "./create";

export { RouteLink } from "./RouteLink";

export const routes = {
  newRequest: createRoute("/new-request", {}),
  home: createRoute("/dashboard", {}),
  dashboard: createRoute("/", {}),
  dashboardNewTopic: createRoute("/new", {}),
  dashboardTopic: createRoute("/[topicId]", { topicId: "string" }),
  team: createRoute("/team", {}),
  logout: createRoute("/logout", {}),
  topic: createRoute("/[topicId]", { topicId: "string" }),
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
