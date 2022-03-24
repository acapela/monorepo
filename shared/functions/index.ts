// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

export type FunctionWithProps<F extends AnyFunction, Props> = F & Props;

export function createFunctionWithProps<F extends AnyFunction, Props>(
  func: F,
  props: Props
): FunctionWithProps<F, Props> {
  const functionClone: F = ((...args: Parameters<F>): ReturnType<F> => {
    return func(...args);
  }) as F;

  const descriptorsMap = Object.getOwnPropertyDescriptors(props);

  Object.defineProperties(functionClone, descriptorsMap);

  return functionClone as FunctionWithProps<F, Props>;
}

export const emptyFunction = () => void 0;
