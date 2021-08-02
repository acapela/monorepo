import { ReactChild, ReactNode, isValidElement, ReactElement } from "react";
import { Route } from "./create";
import { fillParamsInUrl } from "./utils";
import NextLink from "next/link";

interface Props<P> {
  route: Route<P>;
  params: P;
  children: ReactChild;
  passHref?: boolean;
  prefetch?: boolean;
}

function isChildStyledComponentAnchor(child: ReactElement) {
  const childType = child.type;

  if (typeof childType === "string") {
    return childType === "a";
  }

  if (!Reflect.get(childType, "styledComponentId")) return false;

  if (Reflect.get(childType, "target") === "a") {
    return true;
  }

  return false;
}

export function RouteLink<P>({ route, params, children: child, passHref, prefetch }: Props<P>) {
  const hrefWithParams = fillParamsInUrl(route.path, params);

  function getShouldPassHref() {
    if (passHref !== undefined) {
      return passHref;
    }

    if (!isValidElement(child)) {
      return false;
    }

    if (child?.type === "a") {
      return true;
    }

    if (isChildStyledComponentAnchor(child)) {
      return true;
    }

    return false;
  }

  return (
    <NextLink href={hrefWithParams} passHref={getShouldPassHref()} prefetch={prefetch}>
      {child}
    </NextLink>
  );
}
