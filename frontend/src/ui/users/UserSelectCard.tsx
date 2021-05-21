import styled, { css } from "styled-components";
import { TextTitle, SecondaryText } from "~ui/typo";
import { UserBasicInfoFragment } from "~frontend/gql";
import { Avatar } from "./Avatar";
import { ReactNode } from "react";

interface Props {
  user: UserBasicInfoFragment;
  className?: string;
  actions?: ReactNode;
  onSelected?: (user: UserBasicInfoFragment) => void;
  isDisabled?: boolean;
}

export function UserSelectCard({ user, actions, onSelected, isDisabled }: Props) {
  return (
    <UIHolder onClick={() => onSelected?.(user)} isDisabled={isDisabled}>
      <Avatar url={user.avatar_url} />
      <UIInfo>
        <TextTitle>{user.name}</TextTitle>
        <SecondaryText>Team member</SecondaryText>
      </UIInfo>
      {actions && <UIActions>{actions}</UIActions>}
    </UIHolder>
  );
}

const UIHolder = styled.div<{ isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;

  ${(props) => {
    if (props.isDisabled)
      return css`
        opacity: 0.5;
        pointer-events: none;
      `;
  }}
`;

const UIInfo = styled.div`
  margin-left: 0.75rem;
  flex-grow: 1;
`;

const UIActions = styled.div`
  flex-basis: 0;
`;
