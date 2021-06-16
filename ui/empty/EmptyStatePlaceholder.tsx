import { ReactNode } from "react";
import styled from "styled-components";
import { BACKGROUND_ACCENT_WEAK } from "~ui/colors";
import { IconSelection } from "~ui/icons";
import { TextTitle, ItemTitle } from "~ui/typo";

interface Props {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
}

export function EmptyStatePlaceholder({ title, description, icon = <IconSelection /> }: Props) {
  return (
    <UIHolder>
      {icon && <UIIcon>{icon}</UIIcon>}
      {title && <ItemTitle>{title}</ItemTitle>}
      {description && <TextTitle>{description}</TextTitle>}
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
  border-radius: 16px;
  padding: 16px;

  & {
    ${ItemTitle}, ${TextTitle}, ${UIIcon} {
      opacity: 0.8;
    }
  }
`;
