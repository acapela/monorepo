import { ReactNode } from "react";
import styled from "styled-components";
import { TextH3 } from "~ui/typo";
import { borderRadius, shadow } from "~ui/baseStyles";
import { WHITE } from "~ui/colors";

interface Props {
  title: string;
  children: ReactNode;
}

export const MembersManagerContainer = ({ title, children }: Props) => {
  return (
    <UIHolder>
      <TextH3 spezia>{title}</TextH3>
      {children}
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px;

  background: ${WHITE};
  ${borderRadius.modal};
  ${shadow.popover}

  width: 534px;
  @media (max-width: 560px) {
    width: 100%;
  }
`;
