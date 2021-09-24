import { gql } from "@apollo/client";
import React from "react";

import { withFragments } from "~frontend/gql/utils";
import { UserBasicInfo_UserFragment } from "~gql";
import { TextBody14, TextMeta10 } from "~ui/typo";

import { Avatar } from "./Avatar";
import { UserBasicInfoContainer } from "./UserBasicInfoContainer";

const fragments = {
  user: gql`
    fragment UserBasicInfo_user on user {
      name
      email
      avatar_url
    }
  `,
};

type Props = { user: UserBasicInfo_UserFragment };

export const UserBasicInfo = withFragments(fragments, ({ user }: Props) => (
  <UserBasicInfoContainer>
    <Avatar url={user.avatar_url} />
    <div>
      <TextBody14 semibold>{user.name}</TextBody14>
      <TextMeta10 secondary>{user.email}</TextMeta10>
    </div>
  </UserBasicInfoContainer>
));
