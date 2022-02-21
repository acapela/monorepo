import { ComponentType } from "react";
import React from "react";
import styled from "styled-components";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InferProps<C extends ComponentType<any>> = C extends ComponentType<infer P> ? P : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function injectProps<C extends ComponentType<any>>(Component: C, injectedProps: Partial<InferProps<C>>): C {
  function ComponentWithInjectedProps(props: InferProps<C>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalProps: InferProps<C> = { ...injectedProps, ...props } as any;

    return <Component {...finalProps} />;
  }

  Reflect.get(ComponentWithInjectedProps, "name", Component.name);
  Reflect.get(ComponentWithInjectedProps, "displayName", Component.displayName);

  if (Reflect.get(Component, "styledComponentId")) {
    return styled(ComponentWithInjectedProps)<{}>`` as unknown as C;
  }

  return ComponentWithInjectedProps as C;
}
