import { ComponentType, lazy } from "react";
import { PickByValue } from "utility-types";

export function namedLazy<T, K extends keyof PickByValue<T, ComponentType<any>>>(
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
