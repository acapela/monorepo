import { action } from "mobx";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useDb } from "@aca/frontend/clientdb";
import { TeamEntity } from "@aca/frontend/clientdb/team";
import { useCurrentTeamContext } from "@aca/frontend/team/CurrentTeam";
import { routes } from "@aca/shared/routes";
import { Button } from "@aca/ui/buttons/Button";
import { IconPlus } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";
import { addToast } from "@aca/ui/toasts/data";

export const SelectTeamView = observer(() => {
  const db = useDb();
  const teams = db.team.all;
  const teamManager = useCurrentTeamContext();
  const router = useRouter();

  async function handleCreateNewTeam() {
    router.push(routes.teamCreate);
  }

  const handleSelectExistingTeam = action(async (team: TeamEntity) => {
    if (team.isCurrentUserCurrentTeam) {
      router.push(routes.home);
      return;
    }

    try {
      await teamManager.changeTeamId(team.id);

      router.push(routes.home);
    } catch (error) {
      addToast({ title: "Failed to change current team", type: "error" });
    }
  });

  return (
    <UIHolder>
      {teams.length > 0 && (
        <UITeams>
          {teams.map((team) => {
            const isCurrentTeam = team.isCurrentUserCurrentTeam;
            return (
              <UITeam key={team.id}>
                <UITeamInfo>
                  <UITeamName>{team.name}</UITeamName>
                </UITeamInfo>
                {!isCurrentTeam && (
                  <Button size="compact" kind="primary" onClick={() => handleSelectExistingTeam(team)}>
                    Select team
                  </Button>
                )}
                {isCurrentTeam && (
                  <Button size="compact" kind="secondary" onClick={() => handleSelectExistingTeam(team)}>
                    Keep using
                  </Button>
                )}
              </UITeam>
            );
          })}
        </UITeams>
      )}
      <Button onClick={handleCreateNewTeam} kind="primary" isWide icon={<IconPlus />}>
        Create new team
      </Button>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  ${theme.spacing.actions.asGap}
`;

const UITeams = styled.div<{}>`
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  ${theme.spacing.actions.asGap};
`;

const UITeam = styled.div<{}>`
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap}
`;

const UITeamInfo = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  ${theme.spacing.close.asGap}
`;

const UITeamName = styled.div`
  ${theme.typo.item.title};
`;
