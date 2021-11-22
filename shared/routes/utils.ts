import { mapValues } from "lodash";

type LabeledRoutes = Record<string, string | readonly [string, readonly string[]]>;

type Params<Keys extends string> = Record<Keys, string>;

export type RouteBuilder<ParamKeys extends string> = ((params: Params<ParamKeys>) => string) & {
  paramKeys: ParamKeys[];
  path: string;
};

export function parameterizeRoutes<Routes extends LabeledRoutes>(
  routes: Routes
): {
  [Label in keyof Routes]: Routes[Label] extends string ? string : RouteBuilder<Routes[Label][1][number]>;
} {
  return mapValues(routes, (route: string | readonly [string, readonly string[]]) => {
    if (typeof route == "string") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return route as any;
    }
    const [template, paramKeys] = route;
    return Object.assign(
      (params: Params<string>) =>
        paramKeys.reduce((filledIn, key) => filledIn.replaceAll(`[${key}]`, params[key]), template),
      { paramKeys, path: template }
    );
  });
}
