import { useRouter } from "next/router";

import { createRoute } from "./create";

export { RouteLink } from "./RouteLink";

export const routes = {
  newRequest: createRoute("/new", {}),
  topic: createRoute("/[topicId]", { topicId: "string" }),
  home: createRoute("/", {}),
  settings: createRoute("/settings", {}),
  legacyNewTopic: createRoute("/legacy", {}),
  legacyTopic: createRoute("/legacy/[topicId]", { topicId: "string" }),
  logout: createRoute("/logout", {}),
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
