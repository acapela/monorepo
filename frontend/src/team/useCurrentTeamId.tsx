import { useContext } from "react";

import { useUnsafeDb } from "~frontend/clientdb";
import { assertDefined } from "~shared/assert";

import { CurrentTeamIdContext } from "./CurrentTeamIdContext";

export function useCurrentTeamId() {
  return useContext(CurrentTeamIdContext);
}

export function useAssertCurrentTeamId(): string {
  const currentTeamId = useCurrentTeamId();

  return assertDefined(currentTeamId, "No team id");
}

export function useCurrentTeam() {
  const teamId = useCurrentTeamId();
  const db = useUnsafeDb();
  return teamId ? db?.team.findById(teamId) : null;
}

export function useAssertCurrentTeam() {
  const team = useCurrentTeam();
  return assertDefined(team, "no team found");
}
