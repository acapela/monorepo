import slugify from "slugify";
import styled from "styled-components";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useCreateTeam, useTeams } from "~frontend/gql/teams";
import { useChangeCurrentTeamId } from "~frontend/gql/user";
import { Button } from "~ui/button";

export function TeamPickerView() {
  const [data] = useTeams.subscription();
  const user = useAssertCurrentUser();

  const [createTeam] = useCreateTeam();
  const [changeCurrentTeam] = useChangeCurrentTeamId();

  const teams = data?.teams ?? [];

  async function handleCreateNewTeam() {
    const name = prompt("Team name");
    if (!name?.trim()) {
      return;
    }

    const slug = slugify(name);

    await createTeam({ name, slug });
  }

  async function handleChangeTeam(teamId: string) {
    await changeCurrentTeam({ teamId, userId: user.id });

    location.reload();
  }

  return (
    <UIHolder>
      Select or create new team
      <UITeams>
        {teams.map((team) => {
          return (
            <UITeam key={team.id}>
              <div>{team.name}</div>
              <Button onClick={() => handleChangeTeam(team.id)}>Select this team</Button>
            </UITeam>
          );
        })}
        {teams.length === 0 && "You have no teams, create new one"}
      </UITeams>
      <Button onClick={handleCreateNewTeam}>Create new team</Button>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  padding: 20px;
`;

const UITeams = styled.div`
  margin: 3rem 0;
`;

const UITeam = styled.div``;
