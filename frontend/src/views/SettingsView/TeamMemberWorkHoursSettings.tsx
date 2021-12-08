import type { RawTimeZone } from "@vvo/tzdb";
import { observer } from "mobx-react";
import { useMemo, useState } from "react";
import { useEffectOnce } from "react-use";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { useAssertCurrentTeam } from "~frontend/team/CurrentTeam";
import { assert } from "~shared/assert";
import { convertUTCHourToZonedHour, convertZonedHourToUTCHour } from "~shared/dates/utcUtils";
import { SingleOptionDropdown } from "~ui/forms/OptionsDropdown/single";
import { theme } from "~ui/theme";

function getHourLabel(hour: number, startOfRange?: number): string {
  const nextDay = startOfRange && hour <= startOfRange ? ", +1 day" : "";

  if (hour === 0) {
    return `12:00 AM (Midnight)${nextDay}`;
  }
  if (hour === 12) {
    return `12:00 PM (Noon)${nextDay}`;
  }

  if (hour < 12) {
    return `${hour}:00 AM${nextDay}`;
  }

  return `${hour - 12}:00 PM${nextDay}`;
}

export function getZonedHour(utcHour?: number | null, timeZone?: string | null) {
  if (!utcHour || !timeZone) {
    return;
  }

  return convertUTCHourToZonedHour(utcHour, timeZone);
}

export const TeamMemberWorkHoursSettings = observer(function TeamMemberWorkHoursSettings() {
  const db = useDb();
  const userTokenData = useAssertCurrentUser();
  const teamInfo = useAssertCurrentTeam();

  const [rawTimeZones, loadTimezones] = useState<RawTimeZone[]>([]);

  useEffectOnce(() => {
    async function loadTZ() {
      const timeZoneLibrary = await import("@vvo/tzdb");
      loadTimezones(timeZoneLibrary.rawTimeZones);
    }
    loadTZ();
  });

  const currentTeamMember = db.teamMember.query({
    user_id: userTokenData.id,
    team_id: teamInfo.id,
  }).first;

  const currentUserTimezone = currentTeamMember?.timezone;
  const selectedTimezone = useMemo(
    () =>
      currentUserTimezone && rawTimeZones.length > 0
        ? rawTimeZones.find((timeZone) => {
            return currentUserTimezone === timeZone.name || timeZone.group.includes(currentUserTimezone);
          })
        : undefined,
    [currentUserTimezone, rawTimeZones]
  );

  const startOfWorkInUTC = currentTeamMember?.work_start_hour_in_utc;
  const selectedStartOfWork = useMemo(
    () => getZonedHour(startOfWorkInUTC, selectedTimezone?.name),
    [startOfWorkInUTC, selectedTimezone]
  );

  const endOfWorkInUTC = currentTeamMember?.work_end_hour_in_utc;
  const selectedEndOfWork = useMemo(
    () => getZonedHour(endOfWorkInUTC, selectedTimezone?.name),
    [endOfWorkInUTC, selectedTimezone]
  );

  function updateTimezone(timezone: string) {
    currentTeamMember?.update({
      timezone,
    });
  }

  function updateStartWork(startWorkHour: number) {
    assert(selectedTimezone, "timezone must be selected before setting work hours");
    const hourInUtc = convertZonedHourToUTCHour(startWorkHour, selectedTimezone.name);
    currentTeamMember?.update({
      work_start_hour_in_utc: hourInUtc,
    });
  }

  function updateEndWork(endWorkHour: number) {
    assert(selectedTimezone, "timezone must be selected before setting work hours");
    const hourInUtc = convertZonedHourToUTCHour(endWorkHour, selectedTimezone.name);
    currentTeamMember?.update({
      work_end_hour_in_utc: hourInUtc,
    });
  }

  const hours = [...Array(24).keys()];

  return (
    <>
      <UISection>
        <UISectionLabel>Time zone</UISectionLabel>
        <SingleOptionDropdown
          items={rawTimeZones}
          keyGetter={(tz) => tz.name}
          labelGetter={(tz) => tz.rawFormat}
          selectedItem={selectedTimezone}
          onChange={(tz) => updateTimezone(tz.name)}
          placeholder="Please select your timezone..."
        />
        <UISectionDescription>
          Acapela uses timezones to send a daily summary of all the pending requests at the start of your work day.
        </UISectionDescription>
      </UISection>

      <UISection>
        <UISectionLabel>Start and end of work day</UISectionLabel>
        <UIWorkDayRange>
          <SingleOptionDropdown
            items={hours}
            keyGetter={(hour) => hour.toString()}
            selectedItem={selectedStartOfWork}
            labelGetter={getHourLabel}
            isDisabled={!selectedTimezone}
            onChange={updateStartWork}
            placeholder="Select start of work day..."
          />
          to
          <SingleOptionDropdown
            items={hours}
            keyGetter={(hour) => hour.toString()}
            selectedItem={selectedEndOfWork}
            labelGetter={(hour) => getHourLabel(hour, selectedStartOfWork)}
            isDisabled={!selectedTimezone}
            onChange={updateEndWork}
            placeholder="Select end of work day..."
          />
        </UIWorkDayRange>
        <UISectionDescription>
          Acapela will only send you notifications on weekdays within these hours.
        </UISectionDescription>
      </UISection>
    </>
  );
});

const UISection = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const UISectionLabel = styled.div<{}>`
  ${theme.typo.content.bold};
`;

const UISectionDescription = styled.div<{}>`
  ${theme.typo.label.secondary};
`;

const UIWorkDayRange = styled.div<{}>`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: baseline;
`;
