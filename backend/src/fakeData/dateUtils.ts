import { Team, User, db } from "~db";
import { slugify } from "~shared/slugify";
import { subMonths } from "date-fns";
import faker from "faker";
import { sample, sampleSize } from "lodash";

export function getMonthsAgoDate(months: number) {
  return subMonths(new Date(), months);
}
