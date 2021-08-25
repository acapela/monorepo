import * as mudder from "mudder";

/*
  # Using lexicographic indexes for ordering

  When we're creating new list items we'd like to leave open slots that be used when re-ordering. Instead of using
  an integer for indexing, we're using strings.

  Benefits:
  - Strings sort really fast
  - It's easy to append a new char to a string as a way to create a middle-position between strings
    e.g.  english alphabet-based middle between "a" and "b" is "an"
  - It scales without affecting the other indexes in the list

  ## Library usage

  We're using https://github.com/fasiha/mudderjs to find the lexicographic distance between strings. This library
  was created for the same use case.

  This library has support for several "bases" likes:
  - base62: 0-9A-Za-z
  - base36: 0-9a-z
  - alphabet: a-z

  However we chose `alphabet` as, although not the most space efficient, it was the most stable implementation after
  doing considerable testing.

  ## How it works

  ### Pre-allotted indexes
  There's going to be pre-alloted based on the 90 percentile of list sizes (at the time of writing this, it was made
  under the assumption that most topic lists will be shorter than 12). These pre-alloted indexes will help to reserve
  space for items in the list to move around, and helps use keep shorter strings.

  12 Preallocations will look like this:
    --   a
    --   b <- allocated
    --   c
    --   d <- allocated
    --   e
    --   f <- allocated
    --   g
    --   h <- allocated
    --   i
    --   j <- allocated
    --   k
    --   l <- allocated
    --   m
    --   n <- allocated
    --   o
    --   p <- allocated
    --   q
    --   r <- allocated
    --   s
    --   t <- allocated
    --   u
    --   v <- allocated
    --   w
    --   x <- allocated
    --   y
    --   z

  ### Middle distance between indexes

  The middle distance between strings algorithm is best explained here:
  https://stackoverflow.com/questions/38923376/return-a-new-string-that-sorts-between-two-given-strings/38927158#38927158

  Here's the gist of the happy paths:

  start:   a
  end:     c
  middle:  b
  -- 'b' is between 'a' and 'c' in the alphabet, so it's selected

  start:   a
  end:     b
  middle:  an
  -- There's no space in the first char between 'a' and 'b'. We append 'n' is half-way between 'a_' and 'b_'
  -- Consider that a < aa < an < az < b

  ### Getting indexes for first/last in list

  When an empty string is provided for "start" or "end" in mudder, it'll assume that it's trying to find the middle
  between the provided string and the very first/last string available for that base.

  The very first string available: a
  The very last string available: zzzzzzzzz...

*/

const LIST_SIZE_90_PERCENTILE = 12;

const PREALLOTTED_INDEXES = mudder.alphabet.mudder("", "", LIST_SIZE_90_PERCENTILE);

const createMiddleIndex = (start: string, end: string): string => mudder.alphabet.mudder(start, end, 1)[0];

export const getIndexBetweenFirstAndCurrent = (current: string) => createMiddleIndex("", current);

export const getIndexBetweenCurrentAndLast = (current: string) => createMiddleIndex(current, "");

export const getIndexBetweenItems = (start: string, end: string) => createMiddleIndex(start, end);

export function createLastItemIndex(currentLastIndex?: string) {
  if (!currentLastIndex) {
    return PREALLOTTED_INDEXES[0];
  }

  const nextAllottedIndex = PREALLOTTED_INDEXES.find((allottedIndex) => allottedIndex > currentLastIndex);

  return nextAllottedIndex ?? getIndexBetweenCurrentAndLast(currentLastIndex);
}

export function getInitialIndexes(amount: number): string[] {
  if (amount < PREALLOTTED_INDEXES.length) {
    return PREALLOTTED_INDEXES.slice(0, amount);
  }
  // If this room already has a large amount of topics, this will be more optimized
  return mudder.alphabet.mudder("", "", amount);
}
