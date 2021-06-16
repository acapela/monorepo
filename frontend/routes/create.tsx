import { useRouter } from "next/router";
import router from "next/router";
import NextLink from "next/link";
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

export function createRoute<D extends RouteParamsDefinition>(path: string, definition: D) {
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

    return isActive(router.route);
  }

  function isActive(routeToCheck: string) {
    return routeToCheck === path;
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
    useParams,
    push,
    replace,
    useIsActive,
    isActive,
    Link,
    getUrlWithParams,
  };
}

function fillParamsInUrl<Params extends Record<string, unknown>>(href: string, params: Params) {
  let hrefWithParams = href;

  Object.keys(params).forEach((paramName) => {
    const paramValue = params[paramName];

    hrefWithParams = hrefWithParams.replace(`[${paramName}]`, paramValue as string);
  });

  return hrefWithParams;
}
