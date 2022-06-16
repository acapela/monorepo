export const allServices = ["linear", "slack", "github"] as const;
export type Service = typeof allServices[number];
