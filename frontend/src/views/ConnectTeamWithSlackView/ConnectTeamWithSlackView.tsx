import { observer } from "mobx-react";
import router from "next/router";
import { useEffect } from "react";
import styled from "styled-components";

import { LoadingScreen } from "@aca/frontend/clientdb/LoadingScreen";
import { useCurrentTeam } from "@aca/frontend/team/CurrentTeam";
import { AddSlackInstallationButton } from "@aca/frontend/team/SlackInstallationButton";
import { ActionWithAlternative } from "@aca/frontend/ui/ButtonWithAlternative";
import { routes } from "@aca/shared/routes";
import { TextButton } from "@aca/ui/buttons/TextButton";

export const ConnectTeamWithSlackView = observer(() => {
  const currentTeam = useCurrentTeam();

  useEffect(() => {
    if (!currentTeam) {
      router.push(routes.teamSelect);
      return;
    }
    if (!currentTeam.hasSlackInstallation) return;

    router.push(routes.teamInviteMembers);
  }, [currentTeam]);

  if (!currentTeam) {
    return <LoadingScreen />;
  }

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
