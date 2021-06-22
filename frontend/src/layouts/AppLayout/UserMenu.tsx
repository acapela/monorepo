import styled from "styled-components";
import { IconChevronDown, IconSignOut, IconUsers } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { routes } from "~frontend/routes";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { hoverActionCss } from "~ui/transitions";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { convertUserAuthToBasicFragment } from "~frontend/utils/user";

export function UserMenu() {
  const userAuthData = useAssertCurrentUser();

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
        <UIAvatarWithArrow>
          <IconChevronDown />
          <UserAvatar user={convertUserAuthToBasicFragment(userAuthData)} size="small" disableNameTooltip />
        </UIAvatarWithArrow>
      </PopoverMenuTrigger>
    </UIHolder>
  );
}

const UIHolder = styled.div``;

const UIAvatarWithArrow = styled.div`
  display: flex;
  align-items: center;

  & > svg {
    font-size: 24px;
    margin-right: 8px;
  }

  padding: 8px;
  margin: -8px;
  cursor: pointer;

  ${hoverActionCss}
`;
