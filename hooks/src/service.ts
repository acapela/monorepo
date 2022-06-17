export const allServices = ["linear", "slack", "github", "asana", "clickup", "atlassian"] as const;
export type Service = typeof allServices[number];
