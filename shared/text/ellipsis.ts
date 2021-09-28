export function truncateTextWithEllipsis(input: string, allowedLength: number) {
  if (input.length <= allowedLength) return input;

  return `${input.substr(0, allowedLength - 1)}…`;
}
