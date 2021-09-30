import { pick } from "lodash";
import router, { NextRouter, useRouter } from "next/router";

import { assertDefined } from "~shared/assert";
import { isDev } from "~shared/dev";
import { groupByFilter } from "~shared/groupByFilter";

import { InferParamsFromDefinition, RouteParamsDefinition } from "./params";
import { fillParamsInUrl } from "./utils";

interface UrlParams<RouteParams> {
  route: RouteParams;
  query?: Record<string, string>;
}

export interface Route<RouteParams> {
  path: string;
  useParams(): UrlParams<RouteParams> | null;
  useAssertParams(): UrlParams<RouteParams>;
  push(params: RouteParams): Promise<boolean>;
  prefetch(params: RouteParams): Promise<void>;
  replace(params: RouteParams, queryParams?: Record<string, string>): Promise<boolean>;
  useIsActive(): boolean;
  getIsActive(): boolean;
  isMatchingRoute(routeToCheck: string): boolean;
  getUrlWithParams(params: RouteParams): string;
}

export function createRoute<D extends RouteParamsDefinition>(
  path: string,
  definition: D
): Route<InferParamsFromDefinition<D>> {
  type RouteParams = InferParamsFromDefinition<D>;

  if (isDev() && path.includes(":")) {
    console.warn(`createRoute path is incorrect - ${path}. Did you use /foo/:bar instead of /foo/[bar]?`);
  }

  const requiredRouteKeys = Object.keys(definition);
  const isRouteKey = (paramKey: string) => requiredRouteKeys.includes(paramKey);

  function useParams(): UrlParams<RouteParams> | null {
    const router = useRouter();

    if (router.pathname !== path) {
      return null;
    }

    const allParams = router.query;

    requiredRouteKeys.forEach((requiredRouteKey) => {
      if (!allParams[requiredRouteKey]) {
        throw new Error(`useParams used for incompatible route - ${requiredRouteKey} is missing`);
      }
    });

    const [routeKeys, queryKeys] = groupByFilter(Object.keys(allParams), isRouteKey);

    return {
      route: pick(allParams, routeKeys),
      query: pick(allParams, queryKeys),
    } as UrlParams<RouteParams>;
  }

  function useAssertParams(): UrlParams<RouteParams> {
    const router = useRouter();
    const params = useParams();

    return assertDefined(
      params,
      `Cannot use useAssertParams for different route than current one (requested for: ${path}, current: ${router.pathname})`
    );
  }

  function useIsActive() {
    const router = useRouter();

    return isMatchingRoute(router.route);
  }

  function getIsActive(defaultRouter?: NextRouter) {
    if (!defaultRouter && typeof document === "undefined") {
      throw new Error(
        `On server side render calling route.isActive requires providing router from useRouter as an argument`
      );
    }

    return (defaultRouter ?? router).pathname === path;
  }

  function isMatchingRoute(routeToCheck: string) {
    return path === routeToCheck;
  }

  function push(params: RouteParams, additionalParams?: Record<string, string>): Promise<boolean> {
    return router.push({ pathname: path, query: { ...params, ...additionalParams } });
  }

  async function prefetch(params: RouteParams) {
    const hrefWithParams = fillParamsInUrl(path, params);
    await router.prefetch(hrefWithParams);
  }

  function replace(params: RouteParams, additionalParams?: Record<string, string>): Promise<boolean> {
    return router.replace({ pathname: path, query: { ...params, ...additionalParams } });
  }

  function getUrlWithParams(params: RouteParams) {
    return fillParamsInUrl(path, params);
  }

  return {
    path,
    useParams,
    useAssertParams,
    push,
    replace,
    useIsActive,
    getIsActive,
    isMatchingRoute,
    prefetch,
    getUrlWithParams,
  };
}

export type AnyRoute = ReturnType<typeof createRoute>;
