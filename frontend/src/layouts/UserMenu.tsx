import { observer } from "mobx-react";
import router from "next/router";
import React from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useChangeCurrentTeamIdMutation } from "~frontend/gql/user";
import { routes } from "~frontend/router";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { IconButton } from "~ui/buttons/IconButton";
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
        onOpen={() => {
          routes.settings.prefetch({});
        }}
        options={[
          {
            label: "Settings",
            onSelect: () => {
              routes.settings.push({});
            },
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
            openUrlOnSelect: "https://acapela.com",
          },
          {
            label: "Sign out",
            onSelect: () => {
              routes.logout.push({});
              trackEvent("Signed Out");
            },
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
