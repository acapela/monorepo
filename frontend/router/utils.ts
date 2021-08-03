import { isPlainObject } from "lodash";

/**
 * Will prepare full working url from next path and record of params.
 *
 * eg fillParamsInUrl('/[foo]/[bar]', {foo: '1', bar: '2'}) will return `/1/2`
 */
export function fillParamsInUrl<Params>(route: string, params: Params): string {
  let hrefWithParams = route;

  if (!params) {
    return hrefWithParams;
  }

  if (!isPlainObject(params)) {
    return hrefWithParams;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paramsObject = params as Record<any, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.keys(paramsObject as Record<any, any>).forEach((paramName) => {
    const paramValue = paramsObject[paramName];

    hrefWithParams = hrefWithParams.replace(`[${paramName}]`, paramValue as string);
  });

  return hrefWithParams;
}
