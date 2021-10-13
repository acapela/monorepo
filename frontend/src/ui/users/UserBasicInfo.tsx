import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { UserEntity } from "~frontend/clientdb/user";
import { theme } from "~ui/theme";

import { Avatar } from "./Avatar";
import { UserBasicInfoContainer } from "./UserBasicInfoContainer";

type Props = { user: UserEntity };

export const UserBasicInfo = observer(({ user }: Props) => (
  <UserBasicInfoContainer>
    <Avatar size={30} url={user.avatar_url} />
    <div>
      <UIUserName>{user.name}</UIUserName>
      <UIEmail>{user.email}</UIEmail>
    </div>
  </UserBasicInfoContainer>
));

const UIUserName = styled.div`
  ${theme.typo.item.title};
`;

const UIEmail = styled.div`
  ${theme.typo.item.subtitle};
`;
