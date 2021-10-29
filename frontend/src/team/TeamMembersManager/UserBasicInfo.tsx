import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { UserEntity } from "~frontend/clientdb/user";
import { Avatar } from "~frontend/ui/users/Avatar";
import { HStack } from "~ui/Stack";
import { theme } from "~ui/theme";

type Props = { user: UserEntity };

export const UserBasicInfo = observer(({ user }: Props) => (
  <UIHolder>
    <Avatar url={user.avatar_url} size={30} />
    <div>
      <UIUserName>{user.name}</UIUserName>
      <HStack gap={10}>
        <UIEmail>{user.email}</UIEmail>
        {!user.has_account && <UIIndicator>(Invite pending)</UIIndicator>}
      </HStack>
    </div>
  </UIHolder>
));

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap};
`;

const UIUserName = styled.div`
  ${theme.typo.item.title};
`;

const UIEmail = styled.div`
  ${theme.typo.item.subtitle.medium};
`;

const UIIndicator = styled.div`
  ${theme.typo.item.secondaryTitle.secondary};
`;
