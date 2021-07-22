import styled from "styled-components";
import { PRIMARY_PURPLE_1, WHITE } from "~ui/colors";
import { IconUserPlus } from "~ui/icons";
import { borderRadius } from "~ui/baseStyles";
import { UserBasicInfoContainer } from "~frontend/ui/users/UserBasicInfoContainer";
import { TextMeta12Primary, TextMeta10Secondary } from "~ui/typo";

interface Props {
  email: string;
}

export const InvitationPendingIndicator = ({ email }: Props) => {
  return (
    <UserBasicInfoContainer>
      <UIIconHolder>
        <IconUserPlus />
      </UIIconHolder>
      <TextMeta10Secondary>{email}</TextMeta10Secondary>
      <TextMeta12Primary speziaMono>(Invite pending)</TextMeta12Primary>
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
