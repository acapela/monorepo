import { ForwardRefExoticComponent, ForwardRefRenderFunction, PropsWithoutRef, RefAttributes, forwardRef } from "react";

/**
 * Built in forwardRef creates anonymous component which results in bunch of fast-refresh warnings quote:
 *
 * "Anonymous arrow functions cause Fast Refresh to not preserve local component state. Please add a name to your function"
 *
 * This is slight modification to it that prevents it.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function namedForwardRef<T, P = {}>(
  Component: ForwardRefRenderFunction<T, P>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> {
  const ComponentWithForwardRef = forwardRef(Component);

  ComponentWithForwardRef.displayName = Component.displayName ?? "Unknown Component (forwardRef)";

  return ComponentWithForwardRef;
}
