import { ReactNode } from "react";
import styled from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import { BACKGROUND_ACCENT_WEAK } from "~ui/theme/colors/base";
import { IconSelection } from "~ui/icons";
import { TextH3, TextBody } from "~ui/typo";

interface Props {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
}

export function EmptyStatePlaceholder({ title, description, icon = <IconSelection /> }: Props) {
  return (
    <UIHolder>
      {icon && <UIIcon>{icon}</UIIcon>}
      {title && <TextH3>{title}</TextH3>}
      {description && <TextBody spezia>{description}</TextBody>}
    </UIHolder>
  );
}

const UIIcon = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
  opacity: 0.4;
`;

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  background-color: ${BACKGROUND_ACCENT_WEAK};
  ${borderRadius.card}
  padding: 16px;

  & {
    ${TextH3}, ${TextBody}, ${UIIcon} {
      opacity: 0.8;
    }
  }
`;
