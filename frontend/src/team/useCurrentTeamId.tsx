import { useContext } from "react";

import { useDb } from "~frontend/clientdb";
import { assertDefined } from "~shared/assert";

import { CurrentTeamIdContext } from "./CurrentTeamIdContext";

export function useCurrentTeamId() {
  return useContext(CurrentTeamIdContext);
}

export function useAssertCurrentTeamId(): string {
  const currentTeamId = useCurrentTeamId();

  return assertDefined(currentTeamId, "No team id");
}

export function useAssertCurrentTeam() {
  const teamId = useAssertCurrentTeamId();
  const db = useDb();
  return assertDefined(db.team.findById(teamId), "no team found");
}
