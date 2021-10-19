import { observer } from "mobx-react";
import router from "next/router";
import { useEffect } from "react";
import styled from "styled-components";

import { routes } from "~frontend/../../shared/routes";
import { TextButton } from "~frontend/../../ui/buttons/TextButton";
import { useAssertCurrentTeam } from "~frontend/team/CurrentTeam";
import { AddSlackInstallationButton } from "~frontend/team/SlackInstallationButton";
import { ActionWithAlternative } from "~frontend/ui/ButtonWithAlternative";

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
