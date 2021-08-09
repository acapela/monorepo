import styled from "styled-components";
import { CurrentTeamMembersManager } from "./CurrentTeamMembersManager";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { TextMeta10 } from "~ui/typo";
import { useCurrentTeamId } from "~frontend/team/useCurrentTeamId";

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
