import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { useNullableDb } from "~frontend/clientdb";
import { useCurrentTeamContext } from "~frontend/team/CurrentTeam";
import { convertZonedHourToUTCHour } from "~shared/dates/utcUtils";

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

  const startWorkHourInUtc = convertZonedHourToUTCHour(DEFAULT_WORK_DAY_START_HOUR, browserTimezone);
  const endWorkHourInUtc = convertZonedHourToUTCHour(DEFAULT_WORK_DAY_END_HOUR, browserTimezone);

  teamMember.update({
    timezone: browserTimezone,
    work_start_hour_in_utc: startWorkHourInUtc,
    work_end_hour_in_utc: endWorkHourInUtc,
  });
}
