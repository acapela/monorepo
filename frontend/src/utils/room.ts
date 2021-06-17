import { add, roundToNearestMinutes } from "date-fns";

export const getDefaultDeadline = () => {
  const date = add(new Date(), { days: 1 });
  return roundToNearestMinutes(date, { nearestTo: 15 });
};
