import styled from "styled-components";

import { theme } from "~frontend/../../ui/theme";
import { UserBasicInfoContainer } from "~frontend/ui/users/UserBasicInfoContainer";
import { IconUserPlus } from "~ui/icons";

interface Props {
  label: string;
}

export const InvitationPendingIndicator = ({ label }: Props) => {
  return (
    <UserBasicInfoContainer>
      <UIIconHolder>
        <IconUserPlus />
      </UIIconHolder>
      <UILabel>{label}</UILabel>
      <UIStatus>(Invite pending)</UIStatus>
    </UserBasicInfoContainer>
  );
};

const UIIconHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 32px;
  height: 32px;

  /* TODO PR: font size  */
  ${theme.colors.primary.asBgWithReadableText};
  ${theme.radius.circle};
`;

const UILabel = styled.div`
  ${theme.typo.content.bold};
`;

const UIStatus = styled.div`
  ${theme.typo.label.secondary};
`;
