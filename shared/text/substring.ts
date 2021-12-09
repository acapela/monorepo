export function removePrefix(input: string, prefix: string) {
  if (!input.startsWith(prefix)) return input;

  return input.substr(prefix.length);
}
