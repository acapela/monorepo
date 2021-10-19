import { observer } from "mobx-react";
import { signOut } from "next-auth/react";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { routes } from "~shared/routes";
import { IconButton } from "~ui/buttons/IconButton";
import { IconExternalLink, IconGear, IconMoreHoriz, IconSignOut, IconUsers } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

export const UserMenu = observer(function UserMenu() {
  const user = useAssertCurrentUser();

  return (
    <UIHolder>
      <UserAvatar user={user} size={30} disableNameTooltip />
      <PopoverMenuTrigger
        options={[
          {
            label: "Settings",
            href: routes.settings,
            icon: <IconGear />,
          },
          {
            label: "Switch team",
            href: routes.teamSelect,
            icon: <IconUsers />,
          },
          {
            label: "Visit website",
            externalURL: "https://acapela.com",
            icon: <IconExternalLink />,
          },
          {
            label: "Sign out",
            onSelect: () => {
              signOut({ callbackUrl: "/" });
            },
            isDestructive: true,
            icon: <IconSignOut />,
          },
        ]}
      >
        <IconButton icon={<IconMoreHoriz />} />
      </PopoverMenuTrigger>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 8px;
`;
