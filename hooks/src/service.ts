export const allServices = ["linear", "slack", "github", "asana", "clickup"] as const;
export type Service = typeof allServices[number];
