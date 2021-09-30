export const DEFAULT_TOPIC_TITLE_TRUNCATE_LENGTH = 60;

export function truncateTextWithEllipsis(input: string, allowedLength: number) {
  if (input.length <= allowedLength) return input;

  return `${input.substr(0, allowedLength - 1)}…`;
}
