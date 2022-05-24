import { isEqual } from "lodash";
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { observable } from "mobx";
import { createRouter } from "react-chicane";

import { assert } from "@aca/shared/assert";
import { PathArguments, parseUrlWithPattern } from "@aca/shared/urlPattern";

type RoutesMap = Record<string, string>;

type CurrentLocation = ReturnType<ReturnType<typeof createRouter>["getLocation"]>;

type OneOfRoutes<Routes extends RoutesMap> = keyof Routes extends infer R
  ? R extends keyof Routes
    ? {
        name: R;
        params: PathArguments<Routes[R]>;
      }
    : never
  : never;

type EmptyObject = Record<string, never>;
type VoidableParamsOnEmptyObject<T> = T extends EmptyObject ? [] : [T];

export function createObservableRouter<Routes extends RoutesMap>(routes: Routes) {
  const router = createRouter(routes);

  const currentLocation = observable.box<CurrentLocation>(router.getLocation());

  router.subscribe(() => {
    currentLocation.set(router.getLocation());
  });

  function getActiveRoute() {
    const currentRouteURL = currentLocation.get().url;
    // queries are treated as optional, thus their presence should not affect equality
    const [currentRouteURLWithoutQuery] = currentRouteURL.split("?");

    for (const [name, pattern] of Object.entries(routes)) {
      const [patternWithoutQuery] = pattern.split("?");

      const params = parseUrlWithPattern(patternWithoutQuery, currentRouteURLWithoutQuery);

      if (params) {
        return { name, params } as OneOfRoutes<Routes>;
      }
    }

    return null;
  }

  function navigate<Route extends keyof Routes>(
    route: Route,
    ...params: VoidableParamsOnEmptyObject<PathArguments<Routes[Route]>>
  ) {
    Reflect.apply(router.navigate, router, [route, params[0]]);
  }

  function replace<Route extends keyof Routes>(
    route: Route,
    ...params: VoidableParamsOnEmptyObject<PathArguments<Routes[Route]>>
  ) {
    Reflect.apply(router.replace, router, [route, params[0]]);
  }

  function getIsRouteActive<Route extends keyof Routes>(route: Route, params?: PathArguments<Routes[Route]>) {
    const currentRoute = getActiveRoute();

    if (currentRoute?.name !== route) return false;

    if (!params) return true;

    return isEqual(params, currentRoute.params ?? {});
  }

  function getRouteParamsIfActive<Route extends keyof Routes>(route: Route): PathArguments<Routes[Route]> | null {
    const currentRoute = getActiveRoute();

    if (currentRoute?.name !== route) return null;

    return currentRoute.params;
  }

  function assertGetActiveRouteParams<Route extends keyof Routes>(route: Route): PathArguments<Routes[Route]> {
    const params = getRouteParamsIfActive(route);

    assert(params, "Asserted route error");

    return params;
  }

  return {
    get location() {
      return currentLocation.get();
    },
    navigate,
    replace,
    goBack: router.goBack,
    getRouteParamsIfActive,
    assertGetActiveRouteParams,
    getIsRouteActive,
    get activeRoute() {
      return getActiveRoute();
    },
  };
}
