import { RecurranceIntervalInDays } from "./RecurranceIntervalInDays";

export const getRecurranceIntervalInDaysLabel = (recurranceIntervaldInDays: RecurranceIntervalInDays) => {
  if (recurranceIntervaldInDays === null) {
    return "Does not repeat";
  }

  return {
    1: "Daily",
    7: "Weekly",
    28: "Monthly",
  }[recurranceIntervaldInDays];
};
