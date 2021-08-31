export type RecurringDays = number | null;

export const getRecurringDaysLabel = (recurringDays: RecurringDays) => {
  if (recurringDays === null) {
    return "Does not repeat";
  }

  const definedText = {
    1: "Daily",
    7: "Weekly",
    28: "Monthly",
  }[recurringDays];

  return definedText || `Every ${recurringDays} days`;
};
