import { useLayoutEffect } from "react";

import { devAssignWindowVariable } from "@aca/shared/dev";
import { typedKeys } from "@aca/shared/object";
import { PathArguments } from "@aca/shared/urlPattern";

import { createObservableRouter } from "./observableRouter";

const routes = {
  home: "/",
  settings: "/settings/:section",
  notification: "/notifications/:notificationId",
  list: "/list/:listId?:isEditing",
  focus: "/focus",
  compose: "/compose/:url",
  onboarding: "/onboarding",
  connect: "/connect",
  login: "/login",
} as const;

export const allRouteNames = typedKeys(routes);

export const desktopRouter = createObservableRouter(routes);

devAssignWindowVariable("router", desktopRouter);

type Routes = typeof routes;

type EmptyObject = Record<string | number | symbol, never>;

type MaybeParams<T> = T extends infer U ? (U extends EmptyObject ? {} : { params: U }) : {};

type RedirectProps<RouteName extends keyof Routes> = {
  to: RouteName;
} & MaybeParams<PathArguments<Routes[RouteName]>>;

/**
 * Type safe version of Redirect component
 */
export function AppRedirect<RouteName extends keyof Routes>(props: RedirectProps<RouteName>) {
  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isAlreadyActive = desktopRouter.getIsRouteActive(props.to, props.params);

    if (isAlreadyActive) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    desktopRouter.navigate(props.to, props.params);
  }, [props.to, JSON.stringify(Reflect.get(props, "params"))]);

  return null;
}
