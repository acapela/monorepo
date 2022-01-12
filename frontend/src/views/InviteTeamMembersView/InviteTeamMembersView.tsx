import { observer } from "mobx-react";
import router from "next/router";
import styled from "styled-components";

import { useAssertCurrentTeam } from "@aca/frontend/team/CurrentTeam";
import { TeamMembersManager } from "@aca/frontend/team/TeamMembersManager";
import { routes } from "@aca/shared/routes";
import { Button } from "@aca/ui/buttons/Button";
import { theme } from "@aca/ui/theme";

export const InviteTeamMembersView = observer(() => {
  const currentTeam = useAssertCurrentTeam();

  return (
    <UIHolder>
      <TeamMembersManager team={currentTeam} />
      <Button
        kind="primary"
        isWide
        onClick={() => {
          router.push(routes.home);
        }}
      >
        Start using the app
      </Button>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  ${theme.spacing.pageSections.asGap}
`;
