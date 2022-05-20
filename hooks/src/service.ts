export const allServices = ["linear"] as const;
export type Service = typeof allServices[number];
