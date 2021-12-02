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
  const mockUTC = Date.UTC(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), utcHour);

  const zonedDate = utcToZonedTime(mockUTC, timeZone);
  const hoursInTimezoneAsString = format(zonedDate, "HH", { timeZone });

  return Number.parseInt(hoursInTimezoneAsString, 10);
}
