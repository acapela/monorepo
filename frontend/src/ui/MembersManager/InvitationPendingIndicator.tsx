import styled from "styled-components";

import { UserBasicInfoContainer } from "~frontend/ui/users/UserBasicInfoContainer";
import { borderRadius } from "~ui/baseStyles";
import { IconUserPlus } from "~ui/icons";
import { PRIMARY_PURPLE_1, WHITE } from "~ui/theme/colors/base";
import { TextMeta10, TextMeta12 } from "~ui/typo";

interface Props {
  label: string;
}

export const InvitationPendingIndicator = ({ label }: Props) => {
  return (
    <UserBasicInfoContainer>
      <UIIconHolder>
        <IconUserPlus />
      </UIIconHolder>
      <TextMeta10 secondary>{label}</TextMeta10>
      <TextMeta12 primary speziaMono>
        (Invite pending)
      </TextMeta12>
    </UserBasicInfoContainer>
  );
};

const UIIconHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 32px;
  height: 32px;

  font-size: 1.25rem;
  color: ${WHITE};

  background: ${PRIMARY_PURPLE_1};
  ${borderRadius.circle};
`;
