import { memoize } from "lodash";
import { ComponentType, LazyExoticComponent, lazy } from "react";
import { PickByValue } from "utility-types";

import { onDocumentReady } from "~shared/document";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

type WithPreload<C extends AnyComponent> = C & { preload(): Promise<void> };

export function namedLazy<T, K extends keyof PickByValue<T, AnyComponent>>(
  moduleFactory: () => Promise<T>,
  exportName: K
) {
  const loadOnce = memoize(moduleFactory);

  function preload() {
    if (typeof window === "undefined") return;

    return new Promise<void>((resolve) => {
      onDocumentReady(async () => {
        await loadOnce();
        resolve();
      });
    });
  }

  const LazyComponent = lazy(async () => {
    const module = await loadOnce();

    const namedExport = module[exportName];

    // Default react lazy expects 'default' export to be react component.
    return {
      default: namedExport as unknown as AnyComponent,
    };
  });

  Reflect.set(LazyComponent, "preload", preload);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return LazyComponent as unknown as WithPreload<LazyExoticComponent<T[K]>>;
}
