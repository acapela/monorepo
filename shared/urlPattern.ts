import { Split } from "type-fest";
import UrlPattern from "url-pattern";

/**
 * Utility types that convert string /foo/:bar/:baz into {bar: string, baz: string}
 */

type PathSegments<Path extends string, Delimiter extends string> = Split<Path, Delimiter>;
type PathSegment<Path extends string, Delimiter extends string> = PathSegments<Path, Delimiter>[number];
type PathSegmentArgName<Segment extends string> = Segment extends `:${infer ArgName}` ? ArgName : never;
type PathArgNames<Path extends string, Delimiter extends string> = PathSegmentArgName<PathSegment<Path, Delimiter>>;

type UrlParts<S extends string> = { params: Split<S, "?">[0]; search: Split<S, "?">[1] };

type PathArgumentsWithDelimiter<Path extends string | undefined, Delimiter extends string> = Path extends string
  ? {
      [key in PathArgNames<Path, Delimiter>]: string;
    }
  : {};

export type PathArguments<Path extends string> = PathArgumentsWithDelimiter<UrlParts<Path>["params"], "/"> &
  Partial<PathArgumentsWithDelimiter<UrlParts<Path>["search"], "&">>;

type IsEmptyObject<T> = T[keyof T] extends never ? true : false;

// If path has no arguments - returns void instead of empty object
export type PathVoidableArguments<Path extends string> = IsEmptyObject<PathArguments<Path>> extends true
  ? void
  : PathArguments<Path>;

/**
 * Should be
 *
 * type _Test = {
 *   baz: string;
 *   daz: string;
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _Test = PathArguments<"/foo/bar/:baz/daz/:daz?:s1&:s2">;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _test: _Test = {
  baz: "a",
  daz: "b",
  s1: "a",
  s2: "b",
};

export function fillUrlWithArguments<Pattern extends string>(pattern: Pattern, args: PathVoidableArguments<Pattern>) {
  const patternMatcher = new UrlPattern(pattern, urlPatternOptions);

  return patternMatcher.stringify(args);
}

export function parseUrlWithPattern<Pattern extends string>(
  pattern: Pattern,
  url: string
): PathArguments<Pattern> | null {
  const patternMatcher = new UrlPattern(pattern, urlPatternOptions);

  const match = patternMatcher.match(url);

  if (!match) {
    return null;
  }

  return match as PathArguments<Pattern>;
}

export function handleUrlWithPattern<Pattern extends string>(
  pattern: Pattern,
  url: string,
  handler: (args: PathArguments<Pattern>, url: string) => void
) {
  const urlArguments = parseUrlWithPattern(pattern, url);

  if (urlArguments === null) return false;

  handler(urlArguments, url);

  return true;
}

// UrlPatternOptions is not exported from url-pattern, but it is inside - copy pasted
interface UrlPatternOptions {
  escapeChar?: string;
  segmentNameStartChar?: string;
  segmentValueCharset?: string;
  segmentNameCharset?: string;
  optionalSegmentStartChar?: string;
  optionalSegmentEndChar?: string;
  wildcardChar?: string;
}

const urlPatternOptions: UrlPatternOptions = {
  // By default path value can be "a-zA-Z0-9" (would not work with eg auth/<TOKEN>) as token includes "_" and "."
  // https://github.com/snd/url-pattern/issues/26#issuecomment-237181158
  segmentValueCharset: `a-zA-Z0-9-_~%.`,
};
