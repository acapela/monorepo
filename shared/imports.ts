import { typedKeys } from "./object";

export type AnyStarImport = Record<string, unknown>;

/**
 * Converts 'foo' in
 * import * as foo from './foo'
 *
 * into list of everything that is exported
 */
export function convertStarImportsToList<M>(importsMap: M) {
  return typedKeys(importsMap).map((key) => importsMap[key]);
}
