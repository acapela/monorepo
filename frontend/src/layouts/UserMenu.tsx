import router from "next/router";
import React from "react";
import styled from "styled-components";

import { addToast } from "~frontend/../../ui/toasts/data";
import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useChangeCurrentTeamIdMutation } from "~frontend/gql/user";
import { routes } from "~frontend/router";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { IconLoader, IconMoreHoriz } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

export function UserMenu() {
  const user = useAssertCurrentUser();

  const [changeCurrentTeam] = useChangeCurrentTeamIdMutation();

  return (
    <UIHolder>
      <UserAvatar user={user} size="regular" disableNameTooltip />
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
            onSelect: () => {
              window?.open("https://acapela.com", "_blank")?.focus();
            },
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
        <CircleIconButton kind="transparent" icon={<IconMoreHoriz />} />
      </PopoverMenuTrigger>
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 8px;
`;
