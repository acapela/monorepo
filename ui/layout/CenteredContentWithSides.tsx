import { ReactNode } from "react";
import styled from "styled-components";
interface Props {
  children: ReactNode;
  leftNode?: ReactNode;
  rightNode?: ReactNode;
}

export function CenteredContentWithSides({ children, leftNode, rightNode }: Props) {
  return (
    <UIHolder>
      <UILeft>{leftNode}</UILeft>
      <UIMain>{children}</UIMain>
      <UIRight>{rightNode}</UIRight>
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
`;

const UILeft = styled.div<{}>``;
const UIRight = styled.div<{}>`
  display: flex;
  justify-content: flex-end;
`;

const UIMain = styled.div<{}>`
  display: flex;
  justify-content: center;
`;
