import { isPlainObject } from "lodash";

export function fillParamsInUrl<Params>(route: string, params: Params) {
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
