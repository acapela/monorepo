import styled from "styled-components";
import { IconSignOut, IconUsers } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { routes } from "~frontend/routes";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { Avatar } from "~frontend/ui/users/Avatar";

export function UserMenu() {
  const user = useAssertCurrentUser();

  return (
    <UIHolder>
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
        <Avatar disableNameTooltip url={user.picture} name={user.name ?? undefined} />
      </PopoverMenuTrigger>
    </UIHolder>
  );
}

const UIHolder = styled.div``;
