import styled from "styled-components";

import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { useCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { TextMeta10 } from "~ui/typo";

import { CurrentTeamMembersManager } from "./CurrentTeamMembersManager";

const appVersion = process.env.NEXT_PUBLIC_SENTRY_RELEASE;

export const TeamMembersView = () => {
  const currentTeamId = useCurrentTeamId();

  if (!currentTeamId) return null;

  return (
    <SpacedAppLayoutContainer topSpaceSize="large">
      <UIHolder>
        {currentTeamId ? <CurrentTeamMembersManager /> : <div />}
        {appVersion && <TextMeta10 secondary>Version: {appVersion}</TextMeta10>}
      </UIHolder>
    </SpacedAppLayoutContainer>
  );
};

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  min-height: 100%;
`;
