import React from "react";
import { TextBody14 } from "~ui/typo";
import { UserBasicInfoFragment } from "~gql";
import { Avatar } from "./Avatar";
import { UserBasicInfoContainer } from "./UserBasicInfoContainer";
import { UserBasicInfoEmail } from "./UserBasicInfoEmail";

interface Props {
  user: UserBasicInfoFragment;
}

export const UserBasicInfo = ({ user }: Props) => {
  return (
    <UserBasicInfoContainer>
      <Avatar url={user.avatar_url} />
      <div>
        <TextBody14 semibold>{user.name}</TextBody14>
        <UserBasicInfoEmail>{user.email}</UserBasicInfoEmail>
      </div>
    </UserBasicInfoContainer>
  );
};
