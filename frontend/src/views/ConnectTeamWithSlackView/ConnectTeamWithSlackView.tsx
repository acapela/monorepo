import { observer } from "mobx-react";
import router from "next/router";
import { useEffect } from "react";
import styled from "styled-components";

import { useAssertCurrentTeam } from "~frontend/team/CurrentTeam";
import { AddSlackInstallationButton } from "~frontend/team/SlackInstallationButton";
import { ActionWithAlternative } from "~frontend/ui/ButtonWithAlternative";
import { routes } from "~shared/routes";
import { TextButton } from "~ui/buttons/TextButton";

export const ConnectTeamWithSlackView = observer(() => {
  const currentTeam = useAssertCurrentTeam();

  useEffect(() => {
    if (!currentTeam.hasSlackInstallation) return;

    router.push(routes.teamInviteMembers);
  }, [currentTeam.hasSlackInstallation]);

  return (
    <UIHolder>
      <ActionWithAlternative
        alternative={
          <TextButton
            onClick={() => {
              router.push(routes.teamInviteMembers);
            }}
          >
            Skip this step
          </TextButton>
        }
      >
        <AddSlackInstallationButton teamId={currentTeam.id} />
      </ActionWithAlternative>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>``;
