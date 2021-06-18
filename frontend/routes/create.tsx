import NextLink from "next/link";
import router, { NextRouter, useRouter } from "next/router";
import { ComponentType } from "react";
import { ReactNode } from "react";

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

interface LinkProps<Params> {
  params: Params;
  children: ReactNode;
}
export interface Route<Params> {
  path: string;
  useParams(): Params;
  push(params: Params): void;
  replace(params: Params): void;
  useIsActive(): boolean;
  getIsActive(): boolean;
  isMatchingRoute(routeToCheck: string): boolean;
  Link: ComponentType<LinkProps<Params>>;
  getUrlWithParams(params: Params): string;
}

export function createRoute<D extends RouteParamsDefinition>(
  path: string,
  definition: D
): Route<InferParamsFromDefinition<D>> {
  type Params = InferParamsFromDefinition<D>;

  function useParams(): Params {
    const router = useRouter();

    const query = router.query;

    Object.keys(definition).forEach((requiredPathKey) => {
      if (!query[requiredPathKey]) {
        throw new Error(`useParams used for incompatible route - ${requiredPathKey} is missing`);
      }
    });

    return query as Params;
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

  function push(params: Params) {
    router.push({ pathname: path, query: params });
  }

  function replace(params: Params) {
    router.replace({ pathname: path, query: params });
  }

  interface LinkProps {
    params: Params;
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

  function getUrlWithParams(params: Params) {
    return fillParamsInUrl(path, params);
  }

  return {
    path,
    useParams,
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
