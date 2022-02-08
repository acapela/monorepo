export function nullableDate(input?: string | null) {
  if (!input) return null;

  return new Date(input);
}
