import React from "react";
import styled from "styled-components";
import { TextBody14, TextMeta10 } from "~ui/typo";
import { UserBasicInfoFragment } from "~gql";
import { Avatar } from "./Avatar";
import { BASE_GREY_3 } from "~ui/colors";

interface Props {
  user: UserBasicInfoFragment;
}

export const UserBasicInfo = ({ user }: Props) => {
  return (
    <UIHolder>
      <Avatar url={user.avatar_url} />
      <div>
        <TextBody14 semibold>{user.name}</TextBody14>
        <UIEmail>{user.email}</UIEmail>
      </div>
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
`;

const UIEmail = styled(TextMeta10)`
  color: ${BASE_GREY_3};
`;
