import styled from "styled-components";
import { TextTitle, SecondaryText } from "~ui/typo";
import { UserBasicInfoFragment } from "~gql";
import { Avatar } from "./Avatar";
import { ReactNode } from "react";

interface Props {
  user: UserBasicInfoFragment;
  className?: string;
  actions?: ReactNode;
}

export function UserSelectCard({ user, actions }: Props) {
  return (
    <UIHolder>
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
`;

const UIInfo = styled.div`
  margin-left: 0.75rem;
  flex-grow: 1;
`;

const UIActions = styled.div`
  flex-basis: 0;
`;
