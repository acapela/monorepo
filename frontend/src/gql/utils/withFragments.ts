import { DocumentNode } from "graphql";

export function withFragments<Fragments extends Record<string, DocumentNode>, Fn extends Function>(
  fragments: Fragments,
  fn: Fn
): Fn & { fragments: Fragments } {
  return Object.assign(fn, { fragments });
}
