export type RouteParamValueType = "string" | "number";

export type RouteParamType = RouteParamValueType | [RouteParamValueType];

export type RouteParamsDefinition = Record<string, RouteParamType>;

export type InferRouteParamValueType<V extends RouteParamValueType> = V extends "string"
  ? string
  : V extends "number"
  ? number
  : never;

export type InferRouteParamType<T extends RouteParamType> = T extends RouteParamValueType
  ? InferRouteParamValueType<T>
  : T extends [RouteParamValueType]
  ? Array<InferRouteParamValueType<T[0]>>
  : never;

export type InferParamsFromDefinition<D extends RouteParamsDefinition> = {
  [key in keyof D]: InferRouteParamType<D[key]>;
};
