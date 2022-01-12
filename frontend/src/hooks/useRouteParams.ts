import { useRouter } from "next/router";

import { assert } from "@aca/shared/assert";
import { RouteBuilder } from "@aca/shared/routes/utils";

type RouteParams<Keys extends string> = { [Key in Keys]: string };

export function useRouteParams<Keys extends string>({ paramKeys }: RouteBuilder<Keys>): Partial<RouteParams<Keys>> {
  const router = useRouter();
  return Object.fromEntries(paramKeys.map((key) => [key, router.query[key]])) as never;
}

export function useRouteParamsIfRouteActive<Keys extends string>(
  route: RouteBuilder<Keys>
): Partial<RouteParams<Keys>> | null {
  const { path } = route;
  const router = useRouter();

  const isActive = path === router.pathname;

  const params = useRouteParams(route);

  if (!isActive) return null;

  return params;
}

export function useAssertRouteParams<Keys extends string>(route: RouteBuilder<Keys>): RouteParams<Keys> {
  const routeParams = useRouteParams(route);
  const missingKeys = route.paramKeys.filter((key) => routeParams[key] === undefined);
  assert(missingKeys.length == 0, `missing keys in route: ${missingKeys.join(", ")}`);
  return routeParams as never;
}
