import { observer } from "mobx-react";
import styled from "styled-components";

import { TeamEntity } from "@aca/frontend/clientdb/team";
import { SlackInstallationButton } from "@aca/frontend/team/SlackInstallationButton";
import { TeamMembersManager } from "@aca/frontend/team/TeamMembersManager";
import { theme } from "@aca/ui/theme";

import { Panel } from "../ui";

interface Props {
  team: TeamEntity;
}

export const TeamManagerSettingsPanel = observer(({ team }: Props) => {
  return (
    <Panel panelId="team">
      <UIHeader>
        <UITitle>
          {team.name} <span>team</span>
        </UITitle>
      </UIHeader>
      <SlackInstallationButton team={team} />

      <TeamMembersManager team={team} />
    </Panel>
  );
});

const UIHeader = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 4px;
`;

const UITitle = styled.h3<{}>`
  ${theme.typo.secondaryTitle};

  span {
    ${theme.font.secondary};
  }
`;
