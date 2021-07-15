import styled from "styled-components";
import { IconChevronDown, IconSignOut, IconUsers } from "~ui/icons";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { routes } from "~frontend/routes";

export function UserMenu() {
  const user = useAssertCurrentUser();

  return (
    <UIHolder>
      <UserAvatar user={user} size="regular" disableNameTooltip />
      <PopoverMenuTrigger
        options={[
          {
            label: "Manage team",
            icon: <IconUsers />,
            onSelect: () => {
              routes.team.push({});
            },
          },
          {
            label: "Logout",
            icon: <IconSignOut />,
            isDestructive: true,
            onSelect: () => {
              routes.logout.push({});
            },
          },
        ]}
      >
        <CircleIconButton kind="transparent" icon={<IconChevronDown />} />
      </PopoverMenuTrigger>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
