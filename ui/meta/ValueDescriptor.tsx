import React, { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  keyNode: ReactNode;
  isIconKey?: boolean;
  value: ReactNode;
  className?: string;
}

export const ValueDescriptor = ({ keyNode: key, value, isIconKey = false }: Props) => {
  return (
    <UIHolder>
      {isIconKey && <UIHolderIconKey>{key}</UIHolderIconKey>}
      {!isIconKey && <UIHolderKey>{key}</UIHolderKey>}
      <UIHolderValue>{value}</UIHolderValue>
    </UIHolder>
  );
};

const UIHolder = styled.div<{}>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const UIHolderKey = styled.div<{}>`
  line-height: 1.25;
`;

const UIHolderIconKey = styled.div<{}>`
  line-height: 1.25;
  font-size: 1.25rem;
`;

const UIHolderValue = styled.div<{}>``;
