import styled from "styled-components";

import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { useCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { NotificationSettings } from "~frontend/views/TeamMembersView/NotificationSettings";
import { TextMeta10 } from "~ui/typo";

import { CurrentTeamMembersManager } from "./CurrentTeamMembersManager";

const appVersion = process.env.NEXT_PUBLIC_SENTRY_RELEASE;
const appBuildDate = process.env.NEXT_PUBLIC_BUILD_DATE;

export const TeamMembersView = () => {
  const currentTeamId = useCurrentTeamId();

  if (!currentTeamId) {
    return null;
  }

  return (
    <SpacedAppLayoutContainer topSpaceSize="large">
      <UIHolder>
        <CurrentTeamMembersManager />
        <NotificationSettings />

        {appVersion && (
          <TextMeta10 secondary>
            Version: {appVersion} ({appBuildDate})
          </TextMeta10>
        )}
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
