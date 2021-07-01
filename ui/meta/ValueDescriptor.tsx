import React, { ReactNode } from "react";
import styled from "styled-components";
import { BACKGROUND_ACCENT } from "~ui/colors";

interface Props {
  title: ReactNode;
  value: ReactNode;
  className?: string;
}

export const ValueDescriptor = styled(function ValueDescriptor({ title, value }: Props) {
  return (
    <UIHolder>
      <UIHolderKey>{title}:</UIHolderKey> <UIHolderValue>{value}</UIHolderValue>
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const UIHolderKey = styled.div`
  font-weight: 600;
`;

const UIHolderValue = styled.div`
  opacity: 0.5;
`;

export const UIValueDescriptorSeparator = styled.div`
  height: 6px;
  width: 6px;
  border-radius: 6px;
  background-color: ${BACKGROUND_ACCENT};
`;
