export const recurranceIntervalInDaysOptions = [null, 1, 7, 28] as const;

export type RecurranceIntervalInDays = typeof recurranceIntervalInDaysOptions[number];
