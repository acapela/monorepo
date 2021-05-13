import { useRouter } from "next/router";

export function usePathParameter(name: string): string | null {
  const router = useRouter();

  if (!router) return null;

  const { query } = router;
  const parameter = query[name] ?? null;

  return Array.isArray(parameter) ? parameter[0] : parameter;
}

export function getInitials(name: string): string {
  return name
    .toUpperCase()
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
}
