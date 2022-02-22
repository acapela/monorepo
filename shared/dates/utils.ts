export function nullableDate(input?: string | null) {
  if (!input) return null;

  return new Date(input);
}

export function cloneDate(date: Date): Date {
  return new Date(date.getTime());
}
