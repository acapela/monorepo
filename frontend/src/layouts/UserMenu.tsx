import { observer } from "mobx-react";
import router from "next/router";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useChangeCurrentTeamIdMutation } from "~frontend/gql/user";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { routes } from "~shared/routes";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { IconLoader, IconMoreHoriz } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { addToast } from "~ui/toasts/data";

export const UserMenu = observer(function UserMenu() {
  const user = useAssertCurrentUser();

  const [changeCurrentTeam] = useChangeCurrentTeamIdMutation();

  return (
    <UIHolder>
      <UserAvatar user={user} size={30} disableNameTooltip />
      <PopoverMenuTrigger
        options={[
          {
            label: "Settings",
            href: routes.settings,
          },
          {
            label: "Switch teams",
            onSelect: async () => {
              addToast({ icon: <IconLoader />, type: "success", title: "Exiting current team..." });
              await changeCurrentTeam({ userId: user.id, teamId: null });
              router.reload();
            },
          },
          {
            label: "Visit website",
            externalURL: "https://acapela.com",
          },
          {
            label: "Sign out",
            href: routes.logout,
          },
        ]}
      >
        <CircleIconButton icon={<IconMoreHoriz />} />
      </PopoverMenuTrigger>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 8px;
`;
