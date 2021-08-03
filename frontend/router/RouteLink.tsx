import { ReactChild, isValidElement, ReactElement } from "react";
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

/**
 * Will tell if any react node is created from `styled.a`
 */
function isChildStyledComponentAnchor(child: ReactElement) {
  const childType = child.type;

  // If it is plain <a> tag, let's still return true
  if (typeof childType === "string") {
    return childType === "a";
  }

  // Styled component type has some additional props like styledComponentId (which is className root btw. and 'target' where it is taken from styled.<TARGET>)
  if (!Reflect.get(childType, "styledComponentId")) return false;

  if (Reflect.get(childType, "target") === "a") {
    return true;
  }

  return false;
}

export function RouteLink<P>({ route, params, children: child, passHref, prefetch }: Props<P>) {
  const hrefWithParams = fillParamsInUrl(route.path, params);

  /**
   * Next link does not render any dom node on it's own, but attaches to the child. Thus it has no initial knowledge
   * if it should pass `href` prop to child if it's an 'a' element.
   *
   * We'll make this decision automatically here for 2 cases:
   * - child is just 'a' element eg. <RouteLink><a>Foo</a></RouteLink>
   * - child is styled.a element eg const Clicker = styled.a``; <RouteLink><Clicker>Foo</Clicker></RouteLink>
   */
  function getShouldPassHref() {
    // If `passHref` is explicitly set, use it.
    if (passHref !== undefined) {
      return passHref;
    }

    // We're not able to detect the type
    if (!isValidElement(child)) {
      return false;
    }

    // It is plain <a> tag.
    if (child?.type === "a") {
      return true;
    }

    // If it's styled.a, by default pass href.
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
