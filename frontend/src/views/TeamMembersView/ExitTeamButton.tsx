import styled from "styled-components";
import { theme } from "~ui/theme";
import { useChangeCurrentTeamIdMutation } from "~frontend/gql/user";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useEffect } from "react";

export const ExitTeamButton = () => {
  const user = useAssertCurrentUser();

  const [changeCurrentTeam, { loading, data }] = useChangeCurrentTeamIdMutation();

  useEffect(() => {
    if (data) {
      // We rely on the data from the token to determine what is the user's team.
      // To refresh the token, we make a page reload.
      window.location.pathname = "/";
    }
  }, [data]);

  if (loading || data) {
    return <UIStatus>Loading...</UIStatus>;
  }

  const handleClick = () => {
    changeCurrentTeam({ userId: user.id, teamId: null });
  };

  return <UIExitButton onClick={handleClick}>exit the team</UIExitButton>;
};

const UIStatus = styled.p`
  ${theme.font.body12.spezia.build()};
  color: ${theme.colors.layout.supportingText()};
`;

const UIExitButton = styled.button<{}>`
  background: transparent;
  outline: none;
  padding: 0;
  cursor: pointer;

  ${theme.font.body12.spezia.build()};
  color: ${theme.colors.layout.supportingText()};
  text-decoration: underline;
  ${theme.transitions.hover()};
  &:hover {
    color: ${theme.colors.status.error()};
  }
`;
