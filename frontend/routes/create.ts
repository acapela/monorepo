import { useRouter } from "next/router";
import router from "next/router";

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

    console.log({ router });

    return query as Params;
  }

  function push(params: Params) {
    router.push({ pathname: path, query: params });
  }

  return {
    useParams,
    push,
  };
}
