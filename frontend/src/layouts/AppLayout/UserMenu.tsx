import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { routes } from "~frontend/router";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { IconChevronDown } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

export function UserMenu() {
  const user = useAssertCurrentUser();

  return (
    <UIHolder>
      <UserAvatar user={user} size="regular" disableNameTooltip />
      <PopoverMenuTrigger
        onOpen={() => {
          routes.team.prefetch({});
        }}
        options={[
          {
            label: "Manage team",
            onSelect: () => {
              routes.team.push({});
            },
          },
          {
            label: "Logout",
            onSelect: () => {
              routes.logout.push({});
              trackEvent("Signed Out");
            },
          },
        ]}
      >
        <CircleIconButton kind="transparent" icon={<IconChevronDown />} />
      </PopoverMenuTrigger>
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 8px;
`;
