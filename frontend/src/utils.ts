import { useRouter } from "next/router";

export function usePathParameter(name: string): string | undefined {
  const { query } = useRouter();
  const parameter = query[name];
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
