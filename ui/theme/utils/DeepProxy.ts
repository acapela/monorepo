/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapValues } from "lodash";

type AnyFunction = (...args: unknown[]) => unknown;

interface DeepProxyHandlers<T extends object, C> {
  getPrototypeOf?(this: DeepProxyThisArgument<T, C>, target: T): object | null;
  setPrototypeOf?(this: DeepProxyThisArgument<T, C>, target: T, v: any): boolean;
  isExtensible?(this: DeepProxyThisArgument<T, C>, target: T): boolean;
  preventExtensions?(this: DeepProxyThisArgument<T, C>, target: T): boolean;
  getOwnPropertyDescriptor?(
    this: DeepProxyThisArgument<T, C>,
    target: T,
    p: PropertyKey
  ): PropertyDescriptor | undefined;
  has?(this: DeepProxyThisArgument<T, C>, target: T, p: PropertyKey): boolean;
  get?(this: DeepProxyThisArgument<T, C>, target: T, p: PropertyKey, receiver: any): any;
  set?(this: DeepProxyThisArgument<T, C>, target: T, p: PropertyKey, value: any, receiver: any): boolean;
  deleteProperty?(this: DeepProxyThisArgument<T, C>, target: T, p: PropertyKey): boolean;
  defineProperty?(
    this: DeepProxyThisArgument<T, C>,
    target: T,
    p: PropertyKey,
    attributes: PropertyDescriptor
  ): boolean;
  enumerate?(this: DeepProxyThisArgument<T, C>, target: T): PropertyKey[];
  ownKeys?(this: DeepProxyThisArgument<T, C>, target: T): PropertyKey[];
  apply?(this: DeepProxyThisArgument<T, C>, target: T, thisArg: any, argArray?: any): any;
  construct?(this: DeepProxyThisArgument<T, C>, target: T, argArray: any, newTarget?: any): object;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DeepProxyThisArgument<T, C> {
  nest(value?: unknown, context?: C): object;
  parentContext: C;
}

/**
 * Creates deep proxy that can be deeply nested.
 *
 * It works nearly the same as https://github.com/samvv/js-proxy-deep, expect it allows us to pass custom context from
 * parent to child during nesting.
 *
 * proxy-deep is creating new 'path' of strings and passing it (new array reference), but there is literally no way to pass
 * any other piece of data. I deeply checked implementation and concluded it is logically not possible.
 *
 * Took me way too long to figure it out.
 */
export function createDeepProxy<T extends object, C>(input: T, handlers: DeepProxyHandlers<T, C>, parentContext: C): T {
  const customHandlers: ProxyHandler<T> = mapValues(handlers, (originalHandler: AnyFunction) => {
    return function customHandler(...args: any[]) {
      function nest(target: object, context: C) {
        return createDeepProxy(target, handlers, context);
      }

      const thisContext: DeepProxyThisArgument<T, C> = {
        nest,
        parentContext,
      };

      return originalHandler.apply(thisContext, args);
    };
  }) as ProxyHandler<T>;

  return new Proxy(input, customHandlers);
}
