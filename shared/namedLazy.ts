import { ComponentType, lazy } from "react";
import { PickByValue } from "utility-types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

export function namedLazy<T, K extends keyof PickByValue<T, AnyComponent>>(
  moduleFactory: () => Promise<T>,
  exportName: K
) {
  return lazy(async () => {
    const module = await moduleFactory();

    const namedExport = module[exportName];

    // Default react lazy expects 'default' export to be react component.
    return {
      default: namedExport,
    };
  });
}
