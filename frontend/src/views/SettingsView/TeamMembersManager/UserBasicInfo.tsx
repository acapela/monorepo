import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { UserEntity } from "~frontend/clientdb/user";
import { Avatar } from "~frontend/ui/users/Avatar";
import { HStack } from "~ui/Stack";
import { TextBody14, TextMeta10, TextMeta12 } from "~ui/typo";

type Props = { user: UserEntity };

export const UserBasicInfo = observer(({ user }: Props) => (
  <UIHolder>
    <Avatar url={user.avatar_url} />
    <div>
      <TextBody14 semibold>{user.name}</TextBody14>
      <HStack gap={10}>
        <TextMeta10 secondary>{user.email}</TextMeta10>
        {!user.has_account && (
          <TextMeta12 primary speziaMono>
            (Invite pending)
          </TextMeta12>
        )}
      </HStack>
    </div>
  </UIHolder>
));

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 8px;
`;
