import { useRouter } from "next/router";

import { createRoute } from "./create";

export { RouteLink } from "./RouteLink";

export const routes = {
  newRequest: createRoute("/new", {}),
  topic: createRoute("/topic/[topicSlug]", { topicSlug: "string" }),
  home: createRoute("/", {}),
  settings: createRoute("/settings", {}),
  logout: createRoute("/logout", {}),
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
