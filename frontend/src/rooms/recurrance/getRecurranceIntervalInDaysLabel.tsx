export type RecurranceIntervalInDays = number | null;

export const getRecurranceIntervalInDaysLabel = (recurranceIntervaldInDays: RecurranceIntervalInDays) => {
  if (recurranceIntervaldInDays === null) {
    return "Does not repeat";
  }

  const definedText = {
    1: "Daily",
    7: "Weekly",
    28: "Monthly",
  }[recurranceIntervaldInDays];

  return definedText || `Every ${recurranceIntervaldInDays} days`;
};
