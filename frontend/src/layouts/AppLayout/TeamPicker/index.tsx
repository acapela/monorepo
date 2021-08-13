import styled from "styled-components";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { createTeam, useTeamsQuery } from "~frontend/gql/teams";
import { changeCurrentTeamId } from "~frontend/gql/user";
import { Button } from "~ui/buttons/Button";
import { openUIPrompt } from "~frontend/utils/prompt";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { trackEvent } from "~frontend/analytics/tracking";
import { addToast } from "~ui/toasts/data";
import { IconEmotionSmile } from "~ui/icons";

export function TeamPickerView() {
  const [teams = []] = useTeamsQuery();
  const user = useAssertCurrentUser();

  async function handleChangeTeam(teamId: string) {
    await changeCurrentTeamId({ teamId, userId: user.id });
  }

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

    const [team] = await createTeam({ input: { name } });
    if (team) {
      handleChangeTeam(team.id);
    }

    addToast({
      type: "success",
      icon: <IconEmotionSmile />,
      title: "Welcome to Acapela!",
      description:
        "The team has been created successfully and we are happy to have you on board. Now you can invite your team members and start the collaboration!",
    });

    trackEvent("Account Created", { teamName: name });
    trackEvent("Trial Started", { teamName: name });
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

const UIHolder = styled.div<{}>`
  padding: 2rem;
`;

const UITeams = styled.div<{}>`
  margin: 3rem 0;
`;

const UITeam = styled.div<{}>``;
