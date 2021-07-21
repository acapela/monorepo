import styled from "styled-components";
import { PRIMARY_PINK_1, PRIMARY_PURPLE_1, WHITE } from "~ui/colors";
import { IconUserPlus } from "~ui/icons";
import { borderRadius } from "~ui/baseStyles";
import { squareStyle } from "~ui/styleHelpers";
import { UserBasicInfoContainer } from "~frontend/ui/users/UserBasicInfoContainer";
import { UserBasicInfoEmail } from "~frontend/ui/users/UserBasicInfoEmail";
import { TextMeta12 } from "~frontend/../../ui/typo";

interface Props {
  email: string;
}

export const InvitationInfo = ({ email }: Props) => {
  return (
    <UserBasicInfoContainer>
      <UIIconHolder>
        <IconUserPlus />
      </UIIconHolder>
      <UserBasicInfoEmail>{email}</UserBasicInfoEmail>
      <UIStatus speziaMono>(Invite pending)</UIStatus>
    </UserBasicInfoContainer>
  );
};

const UIIconHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  ${squareStyle(32)};

  font-size: 1.25rem;
  color: ${WHITE};

  background: ${PRIMARY_PURPLE_1};
  ${borderRadius.circle};
`;

const UIStatus = styled(TextMeta12)`
  color: ${PRIMARY_PINK_1};
`;
