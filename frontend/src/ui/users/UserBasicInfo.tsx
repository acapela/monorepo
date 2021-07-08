import React from "react";
import styled from "styled-components";
import { TextBody, TextH3 } from "~ui/typo";
import { UserBasicInfoFragment } from "~gql";
import { Avatar } from "./Avatar";

interface Props {
  user: UserBasicInfoFragment;
}

export const UserBasicInfo = ({ user }: Props) => {
  return (
    <UIHolder>
      <Avatar url={user.avatar_url} />
      <div>
        <TextBody medium>{user.name}</TextBody>
        <TextBody>{user.email}</TextBody>
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
