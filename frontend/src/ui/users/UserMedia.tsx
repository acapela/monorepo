import React from "react";
import styled from "styled-components";
import { SecondaryText, TextTitle } from "~frontend/../../ui/typo";
import { UserBasicInfoFragment } from "~frontend/gql";
import { Avatar } from "./Avatar";

interface Props {
  user: UserBasicInfoFragment;
}

export const UserMedia = ({ user }: Props) => {
  return (
    <UIHolder>
      <Avatar url={user.avatar_url} />
      <div>
        <TextTitle>{user.name}</TextTitle>
        <SecondaryText>{user.email}</SecondaryText>
      </div>
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
`;
