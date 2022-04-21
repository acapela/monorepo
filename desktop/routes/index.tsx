/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createAtom } from "mobx";
import { useLayoutEffect } from "react";
import { createRouter } from "react-chicane";
import { ExtractRoutesParams, GetNestedRoutes, ParamsArg, PrependBasePath } from "react-chicane/dist/types";

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
type BasePath = string;

export function getRouteParamsIfActive<R extends keyof Routes>(route: R): PathArguments<Routes[R]> | null {
  const router = getObservedRouter();
  const currentRouteURL = router.getLocation().url;
  // queries are treated as optional, thus their presence should not affect equality
  const [currentRouteURLWithoutQuery] = currentRouteURL.split("?");

  const pattern = routes[route];
  const [patternWithoutQuery] = pattern.split("?");

  return parseUrlWithPattern(patternWithoutQuery as typeof pattern, currentRouteURLWithoutQuery);
}

export function assertGetActiveRouteParams<R extends keyof Routes>(route: R): PathArguments<Routes[R]> {
  const params = getRouteParamsIfActive(route);

  assert(params, `Asserting params for active route ${route}, but it is not active`);

  return params;
}

export function getIsRouteActive(route: keyof Routes): boolean {
  return getRouteParamsIfActive(route) !== null;
}

/**
 * Returns true if given route is currently active.
 *
 * Is mobx-aware - will make mobx context to re-run it if route changes
 *
 * Note: type signature is copy-pasted from `createURL` types.
 */
export const getExactIsRouteActive: <
  RouteName extends Exclude<keyof Routes, keyof GetNestedRoutes<PrependBasePath<Routes, BasePath>>>
>(
  routeName: RouteName,
  ...args: ParamsArg<
    ExtractRoutesParams<
      Omit<PrependBasePath<Routes, BasePath>, keyof GetNestedRoutes<PrependBasePath<Routes, BasePath>>>
    >[RouteName]
  >
) => boolean = (routeName, ...args) => {
  const router = getObservedRouter();
  router;
  const routeUrl = router.createURL(routeName, ...args);
  const currentRouteUrl = router.getLocation().url;

  return routeUrl === currentRouteUrl;
};

type MaybeParams<T> = T extends [infer U] ? { params: U } : {};

type RedirectProps<RouteName extends Exclude<keyof Routes, keyof GetNestedRoutes<PrependBasePath<Routes, BasePath>>>> =
  {
    to: RouteName;
  } & MaybeParams<
    ParamsArg<
      ExtractRoutesParams<
        Omit<PrependBasePath<Routes, BasePath>, keyof GetNestedRoutes<PrependBasePath<Routes, BasePath>>>
      >[RouteName]
    >
  >;

/**
 * Type safe version of Redirect component
 */
export function AppRedirect<
  RouteName extends Exclude<keyof Routes, keyof GetNestedRoutes<PrependBasePath<Routes, BasePath>>>
>(props: RedirectProps<RouteName>) {
  useLayoutEffect(() => {
    // @ts-ignore
    const isAlreadyActive = getExactIsRouteActive(props.to, props.params);

    if (isAlreadyActive) return;

    // @ts-ignore
    desktopRouter.navigate(props.to, props.params);
  }, [props.to]);

  return null;
}