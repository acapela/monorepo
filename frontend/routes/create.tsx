import { pick } from "lodash";
import NextLink from "next/link";
import router, { NextRouter, useRouter } from "next/router";
import { ComponentType } from "react";
import { ReactNode } from "react";

import { groupByFilter } from "~shared/groupByFilter";

type RouteParamValueType = "string" | "number";

type RouteParamType = RouteParamValueType | [RouteParamValueType];

type RouteParamsDefinition = Record<string, RouteParamType>;

type InferRouteParamValueType<V extends RouteParamValueType> = V extends "string"
  ? string
  : V extends "number"
  ? number
  : never;

type InferRouteParamType<T extends RouteParamType> = T extends RouteParamValueType
  ? InferRouteParamValueType<T>
  : T extends [RouteParamValueType]
  ? Array<InferRouteParamValueType<T[0]>>
  : never;

type InferParamsFromDefinition<D extends RouteParamsDefinition> = {
  [key in keyof D]: InferRouteParamType<D[key]>;
};

interface LinkProps<RouteParams> {
  params: RouteParams;
  children: ReactNode;
}

interface UrlParams<RouteParams> {
  route: RouteParams;
  query?: Record<string, string>;
}

export interface Route<RouteParams> {
  path: string;
  useParams(): UrlParams<RouteParams> | null;
  useAssertParams(): UrlParams<RouteParams>;
  push(params: RouteParams): Promise<boolean>;
  replace(params: RouteParams, queryParams?: Record<string, string>): Promise<boolean>;
  useIsActive(): boolean;
  getIsActive(): boolean;
  isMatchingRoute(routeToCheck: string): boolean;
  Link: ComponentType<LinkProps<RouteParams>>;
  getUrlWithParams(params: RouteParams): string;
}

export function createRoute<D extends RouteParamsDefinition>(
  path: string,
  definition: D
): Route<InferParamsFromDefinition<D>> {
  type RouteParams = InferParamsFromDefinition<D>;

  const requiredRouteKeys = Object.keys(definition);
  const isRouteKey = (paramKey: string) => requiredRouteKeys.includes(paramKey);

  function useParams(): UrlParams<RouteParams> | null {
    const router = useRouter();

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

  function replace(params: RouteParams, additionalParams?: Record<string, string>): Promise<boolean> {
    return router.replace({ pathname: path, query: { ...params, ...additionalParams } });
  }

  interface LinkProps {
    params: RouteParams;
    children: ReactNode;
  }

  function Link({ params, children }: LinkProps) {
    const hrefWithParams = fillParamsInUrl(path, params);

    return (
      <NextLink href={hrefWithParams} passHref>
        {children}
      </NextLink>
    );
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
    Link,
    getUrlWithParams,
  };
}

export type AnyRoute = ReturnType<typeof createRoute>;

function fillParamsInUrl<Params extends Record<string, unknown>>(href: string, params: Params) {
  let hrefWithParams = href;

  if (!params) {
    return hrefWithParams;
  }

  Object.keys(params).forEach((paramName) => {
    const paramValue = params[paramName];

    hrefWithParams = hrefWithParams.replace(`[${paramName}]`, paramValue as string);
  });

  return hrefWithParams;
}
