export const allServices = ["linear", "slack"] as const;
export type Service = typeof allServices[number];
