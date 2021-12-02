import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { useNullableDb } from "~frontend/clientdb";
import { useCurrentTeamContext } from "~frontend/team/CurrentTeam";

interface Props {
  skip?: boolean;
}

const DEFAULT_WORK_DAY_START_HOUR = 9;
const DEFAULT_WORK_DAY_END_HOUR = 18;

// Sets the default work day parameters if not set before
// This allows us to send over daily emails with a summary
export function useAppInitBatchProcedures({ skip }: Props) {
  const db = useNullableDb();
  const userTokenData = useCurrentUserTokenData();
  const teamInfo = useCurrentTeamContext();

  const teamMember =
    !skip &&
    userTokenData &&
    db &&
    teamInfo.teamId &&
    db.teamMember.query({
      user_id: userTokenData.id,
      team_id: teamInfo.teamId,
    }).first;

  if (!teamMember) {
    return;
  }

  if (teamMember.timezone || teamMember.work_start_hour_in_utc || teamMember.work_end_hour_in_utc) {
    return;
  }

  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (!browserTimezone) {
    return;
  }

  // Can be negative or positive, e.g -2, 8, etc
  // Unusual timezones (like UTC+12:45) will use a full hour
  const timezoneOffsetInHours = Math.ceil(new Date().getTimezoneOffset() / 60);

  let startWorkHourInUtc;
  let endWorkHourInUtc;

  // Use Case: Hawaii where `timezoneOffsetInHours === -10`
  if (timezoneOffsetInHours + DEFAULT_WORK_DAY_START_HOUR < 0) {
    // Use Case: Hawaii `startWorkTimeInUtc = 24 + (-10) + 9 === 23`
    startWorkHourInUtc = 24 + timezoneOffsetInHours + DEFAULT_WORK_DAY_START_HOUR;
  } else {
    startWorkHourInUtc = timezoneOffsetInHours + DEFAULT_WORK_DAY_START_HOUR;
  }

  // Use Case: Hawaii where `timezoneOffsetInHours === 11`
  if (timezoneOffsetInHours + DEFAULT_WORK_DAY_END_HOUR >= 24) {
    // Use Case: Sydney `endWorkTimeInUtc = 11 + (18) - 24 === 5`
    endWorkHourInUtc = timezoneOffsetInHours + DEFAULT_WORK_DAY_END_HOUR - 24;
  } else {
    endWorkHourInUtc = timezoneOffsetInHours + DEFAULT_WORK_DAY_END_HOUR;
  }

  teamMember.update({
    timezone: browserTimezone,
    work_start_hour_in_utc: startWorkHourInUtc,
    work_end_hour_in_utc: endWorkHourInUtc,
  });
}
