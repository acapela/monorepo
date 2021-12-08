import { format, getTimezoneOffset, utcToZonedTime } from "date-fns-tz";

export function convertZonedHourToUTCHour(zonedHour: number, timeZone: string) {
  // Convert offsets west from UTC as negative and east from UTC as positive
  // Unusual timezones (like UTC+12:45) will use a full hour with Math.ceil
  // 3600000 === (60 m in h) * (60 s in m) * (1000 ms in s)
  const timezoneOffsetInHours = Math.ceil((-1 * getTimezoneOffset(timeZone)) / 3600000);

  if (timezoneOffsetInHours + zonedHour < 0) {
    // Use Case: Hawaii where `timezoneOffsetInHours === -10`
    // `startWorkTimeInUtc = 24 + (-10) + 9 === 23`
    return 24 + timezoneOffsetInHours + zonedHour;
  } else if (timezoneOffsetInHours + zonedHour >= 24) {
    // Use Case: Sydney where `timezoneOffsetInHours === 11`
    // `endWorkTimeInUtc = 11 + (18) - 24 === 5`
    return timezoneOffsetInHours + zonedHour - 24;
  } else {
    return timezoneOffsetInHours + zonedHour;
  }
}

export function convertUTCHourToZonedHour(utcHour: number, timeZone: string) {
  const mockDate = new Date();

  // Creating a mock UTC date prevents the Date constructor from adding the local system timezone
  // We add here the `utcHour`, in most cases this is stored in the db this way
  const mockUTC = Date.UTC(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), utcHour);

  // This creates a new date object with a specific timezone
  const zonedDate = utcToZonedTime(mockUTC, timeZone);

  // We need to extract the "Hour" component of zoned date
  // The easiest way to do this is by printing a formatted date that only included the hour portion
  // otherwise. utils like date.getHour() will always convert to local timezone
  const hoursInTimezoneAsString = format(zonedDate, "HH", { timeZone });

  // Most risky part of the operation. We convert this into a decimal number.
  return Number.parseInt(hoursInTimezoneAsString, 10);
}

export function getZonedHour(utcHour?: number | null, timeZone?: string | null) {
  if (!utcHour || !timeZone) {
    return;
  }

  return convertUTCHourToZonedHour(utcHour, timeZone);
}
