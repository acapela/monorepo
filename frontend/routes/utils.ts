import { pick } from "lodash";
import NextLink from "next/link";
import router, { NextRouter, useRouter } from "next/router";

import { ComponentType } from "react";
import { ReactNode } from "react";
import { groupByFilter } from "~shared/groupByFilter";
import { isRecord } from "~shared/object/isRecord";

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

export function fillParamsInUrl<Params>(href: string, params: Params) {
  let hrefWithParams = href;

  if (!params) {
    return hrefWithParams;
  }

  if (!isRecord(params)) {
    return hrefWithParams;
  }

  const paramsObject = params as Record<any, any>;

  Object.keys(paramsObject as Record<any, any>).forEach((paramName) => {
    const paramValue = paramsObject[paramName];

    hrefWithParams = hrefWithParams.replace(`[${paramName}]`, paramValue as string);
  });

  return hrefWithParams;
}
