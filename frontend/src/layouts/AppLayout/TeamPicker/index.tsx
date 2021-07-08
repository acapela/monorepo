import { slugify } from "~shared/slugify";
import styled from "styled-components";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useCreateTeamMutation, useTeamsQuery } from "~frontend/gql/teams";
import { useChangeCurrentTeamIdMutation } from "~frontend/gql/user";
import { Button } from "~ui/buttons/Button";
import { openUIPrompt } from "~frontend/utils/prompt";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { trackEvent } from "~frontend/analytics/tracking";

export function TeamPickerView() {
  const [teams = []] = useTeamsQuery();
  const user = useAssertCurrentUser();

  const [createTeam] = useCreateTeamMutation();
  const [changeCurrentTeam] = useChangeCurrentTeamIdMutation();

  async function handleCreateNewTeam() {
    const name = await openUIPrompt({
      title: "Team name",
      placeholder: "Team name...",
      submitLabel: "Create new team",
      validateInput: createLengthValidator("Team name", 3),
    });
    if (!name?.trim()) {
      return;
    }

    const slug = slugify(name);

    await createTeam({ name, slug });

    trackEvent("Account Created");
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
  padding: 2rem;
`;

const UITeams = styled.div`
  margin: 3rem 0;
`;

const UITeam = styled.div``;
