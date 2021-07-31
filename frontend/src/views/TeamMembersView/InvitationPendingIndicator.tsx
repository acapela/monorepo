import styled from "styled-components";
import { PRIMARY_PURPLE_1, WHITE } from "~ui/theme/colors/base";
import { IconUserPlus } from "~ui/icons";
import { borderRadius } from "~ui/baseStyles";
import { UserBasicInfoContainer } from "~frontend/ui/users/UserBasicInfoContainer";
import { TextMeta12, TextMeta10 } from "~ui/typo";

interface Props {
  email: string;
}

export const InvitationPendingIndicator = ({ email }: Props) => {
  return (
    <UserBasicInfoContainer>
      <UIIconHolder>
        <IconUserPlus />
      </UIIconHolder>
      <TextMeta10 secondary>{email}</TextMeta10>
      <TextMeta12 primary speziaMono>
        (Invite pending)
      </TextMeta12>
    </UserBasicInfoContainer>
  );
};

const UIIconHolder = styled.div`
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
