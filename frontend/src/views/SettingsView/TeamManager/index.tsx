import { observer } from "mobx-react";
import styled from "styled-components";

import { TeamEntity } from "~frontend/clientdb/team";
import { SlackInstallationButton } from "~frontend/team/SlackInstallationButton";
import { TeamMembersManager } from "~frontend/team/TeamMembersManager";
import { theme } from "~ui/theme";

interface Props {
  team: TeamEntity;
}

export const TeamManagerSettingsPanel = observer(({ team }: Props) => {
  return (
    <UIPanel>
      <UIHeader>
        <UITitle>
          {team.name} <span>team</span>
        </UITitle>
      </UIHeader>
      <SlackInstallationButton team={team} />

      <TeamMembersManager team={team} />
    </UIPanel>
  );
});

const UIPanel = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px;

  ${theme.colors.layout.background.withBorder.asBg};
  ${theme.radius.panel};

  width: 100%;
`;

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
