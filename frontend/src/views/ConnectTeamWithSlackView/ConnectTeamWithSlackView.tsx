import { observer } from "mobx-react";
import { useState } from "react";
import styled from "styled-components";

import { useAssertCurrentTeam } from "~frontend/team/CurrentTeam";
import { AddSlackInstallationButton } from "~frontend/team/SlackInstallationButton";

export const ConnectTeamWithSlackView = observer(() => {
  const currentTeam = useAssertCurrentTeam();
  const [name, setName] = useState("");

  return (
    <UIHolder>
      <AddSlackInstallationButton teamId={currentTeam.id} />
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>``;
