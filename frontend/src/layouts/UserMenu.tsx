import { observer } from "mobx-react";
import { signOut } from "next-auth/react";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "@aca/frontend/authentication/useCurrentUser";
import { UserAvatar } from "@aca/frontend/ui/users/UserAvatar";
import { routes } from "@aca/shared/routes";
import { IconExternalLink, IconGear, IconSignOut, IconUsers } from "@aca/ui/icons";
import { PopoverMenuTrigger } from "@aca/ui/popovers/PopoverMenuTrigger";
import { theme } from "@aca/ui/theme";

export const UserMenu = observer(function UserMenu() {
  const user = useAssertCurrentUser();

  return (
    <UIHolder>
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
        <UserAvatar user={user} size={30} disableNameTooltip />
      </PopoverMenuTrigger>
      <UIHoverIndicator />
    </UIHolder>
  );
});

const HOVER_OFFSET_PX = 2;

const UIHoverIndicator = styled.div`
  position: absolute;
  top: ${-HOVER_OFFSET_PX}px;
  left: ${-HOVER_OFFSET_PX}px;
  right: ${-HOVER_OFFSET_PX}px;
  bottom: ${-HOVER_OFFSET_PX}px;
  ${theme.colors.layout.backgroundAccent.active.asBg};
  ${theme.radius.circle};
  z-index: 1;
`;

const UIHolder = styled.div<{}>`
  position: relative;
  ${UserAvatar} {
    position: relative;
    cursor: pointer;
    z-index: 2;
  }

  ${UIHoverIndicator} {
    opacity: 0;
    transform: scale(1.2);
    transition: 0.2s all;
  }

  &:hover {
    ${UIHoverIndicator} {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
