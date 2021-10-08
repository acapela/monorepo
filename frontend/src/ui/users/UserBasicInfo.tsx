import { observer } from "mobx-react";
import React from "react";

import { UserEntity } from "~frontend/clientdb/user";
import { TextBody14, TextMeta10 } from "~ui/typo";

import { Avatar } from "./Avatar";
import { UserBasicInfoContainer } from "./UserBasicInfoContainer";

type Props = { user: UserEntity };

export const UserBasicInfo = observer(({ user }: Props) => (
  <UserBasicInfoContainer>
    <Avatar url={user.avatar_url} />
    <div>
      <TextBody14 semibold>{user.name}</TextBody14>
      <TextMeta10 secondary>{user.email}</TextMeta10>
    </div>
  </UserBasicInfoContainer>
));
