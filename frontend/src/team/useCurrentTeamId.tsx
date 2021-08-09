import { useContext } from "react";
import { assertDefined } from "~shared/assert";
import { CurrentTeamIdContext } from "./CurrentTeamIdContext";

export function useCurrentTeamId() {
  return useContext(CurrentTeamIdContext);
}

export function useAssertCurrentTeamId(): string {
  const currentTeamId = useCurrentTeamId();

  return assertDefined(currentTeamId, "No team id");
}
