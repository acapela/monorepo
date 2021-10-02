import { DocumentNode } from "graphql";

import { analyzeFragment } from "./analyzeFragment";

export function getFragmentKeys<FragmentType = Record<string, unknown>>(
  fragment: DocumentNode
): Array<keyof FragmentType> {
  return analyzeFragment<FragmentType>(fragment).keys;
}
