import { isEqual } from "lodash";
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createAtom } from "mobx";
import { useLayoutEffect } from "react";
import { createRouter } from "react-chicane";

import { cachedComputed } from "@aca/clientdb";
import { assert } from "@aca/shared/assert";
import { devAssignWindowVariable } from "@aca/shared/dev";
import { typedKeys } from "@aca/shared/object";
import { PathArguments, parseUrlWithPattern } from "@aca/shared/urlPattern";

const routes = {
  home: "/",
  settings: "/settings/:section",
  notification: "/notifications/:notificationId",
  list: "/list/:listId?:isEditing",
  focus: "/focus/:listId/:notificationId",
  compose: "/compose/:url",
  onboarding: "/onboarding",
  connect: "/connect",
  login: "/login",
} as const;

export const allRouteNames = typedKeys(routes);

export const desktopRouter = createRouter(routes);

devAssignWindowVariable("router", desktopRouter);

/**
 * We want to be able to check if given route is active:
 * 1.  in type safe way (react-chicane does not provide such function, even tho it is obvious to create, but hard to make type-safe)
 * Thus we copy-pasted `createURL` types with only change of result being boolean, not string
 *
 * 2. We want getIsCurrentRoute to be mobx-observable so eg. actions that have 'canApply' based on that
 * would re-render correctly.
 *
 * Thus we also hook mobx atom to this function
 */

// Atom that will be 'pinged' on each route change
export const routeChangeAtom = createAtom("route-change");

// Let's ping atom on route changes
desktopRouter.subscribe(() => {
  routeChangeAtom.reportChanged();
});

// It simply returns router, but in case this function is called in mobx context, mobx will know to re-run it if route changes
export function getObservedRouter() {
  routeChangeAtom.reportObserved();
  return desktopRouter;
}

type Routes = typeof routes;
type RouteName = keyof Routes;

type RoutesMap = Record<string, string>;

type OneOfRoutes<Routes extends RoutesMap> = keyof Routes extends infer R
  ? R extends keyof Routes
    ? {
        name: R;
        params: PathArguments<Routes[R]>;
      }
    : never
  : never;

export const getActiveRouteOf = cachedComputed(function getRouteParamsIfActive<R extends RoutesMap>(
  routes: R
): OneOfRoutes<R> | null {
  const router = getObservedRouter();
  const currentRouteURL = router.getLocation().url;
  // queries are treated as optional, thus their presence should not affect equality
  const [currentRouteURLWithoutQuery] = currentRouteURL.split("?");

  for (const [name, pattern] of Object.entries(routes)) {
    const [patternWithoutQuery] = pattern.split("?");

    const params = parseUrlWithPattern(patternWithoutQuery, currentRouteURLWithoutQuery);

    if (params) {
      return { name, params } as OneOfRoutes<R>;
    }
  }

  return null;
});

export const getActiveRoute = cachedComputed(function getActiveRoute() {
  return getActiveRouteOf(routes);
});

const f = getActiveRoute();

if (f?.name === "list") {
  f.params;
}

export const getRouteParamsIfActive = cachedComputed(function getRouteParamsIfActive<R extends keyof Routes>(
  route: R
): PathArguments<Routes[R]> | null {
  const activeRoute = getActiveRoute();

  if (activeRoute?.name === route) {
    return activeRoute.params as PathArguments<Routes[R]>;
  }

  return null;
});

export function assertGetActiveRouteParams<R extends keyof Routes>(route: R): PathArguments<Routes[R]> {
  const params = getRouteParamsIfActive(route);

  assert(params, `Asserting params for active route ${route}, but it is not active`);

  return params;
}

export const getIsRouteActive = cachedComputed(function getIsRouteActive(route: keyof Routes): boolean {
  return getActiveRoute()?.name === route;
});

type EmptyObject = Record<string | number | symbol, never>;

type VoidableArgumetnOnEmptyObject<A> = A extends EmptyObject ? [] : [A];

/**
 * Returns true if given route is currently active.
 *
 * Is mobx-aware - will make mobx context to re-run it if route changes
 *
 * Note: type signature is copy-pasted from `createURL` types.
 */
function _getExactIsRouteActive<R extends RouteName>(
  routeName: R,
  ...args: VoidableArgumetnOnEmptyObject<PathArguments<Routes[R]>>
): boolean {
  const activeRoute = getActiveRoute();

  if (activeRoute?.name !== routeName) return false;

  const [params] = args;

  return isEqual(params ?? {}, activeRoute.params ?? {});
}

export const getExactIsRouteActive = cachedComputed(_getExactIsRouteActive);

type MaybeParams<T> = T extends infer U ? (U extends EmptyObject ? {} : { params: U }) : {};

type RedirectProps<RouteName extends keyof Routes> = {
  to: RouteName;
} & MaybeParams<PathArguments<Routes[RouteName]>>;

/**
 * Type safe version of Redirect component
 */
export function AppRedirect<RouteName extends keyof Routes>(props: RedirectProps<RouteName>) {
  useLayoutEffect(() => {
    // @ts-ignore
    const isAlreadyActive = getExactIsRouteActive(props.to, props.params);

    if (isAlreadyActive) return;

    // @ts-ignore
    desktopRouter.navigate(props.to, props.params);
  }, [props.to, JSON.stringify(Reflect.get(props, "params"))]);

  return null;
}
