import React, { ReactNode } from "react";
import styled from "styled-components";
import { FieldLabel } from "~ui/typo";

interface Props {
  label?: string;
  children: ReactNode;
  onLabelClick?: () => void;
  className?: string;
}

export const FieldWithName = styled(({ label, children, onLabelClick, className }: Props) => {
  return (
    <UIFormField className={className}>
      {!!label && <FieldLabel onClick={onLabelClick}>{label}</FieldLabel>}
      {children}
    </UIFormField>
  );
})``;

const UIFormField = styled.div`
  display: flex;
  flex-direction: column;
  & > ${FieldLabel} {
    margin-bottom: 8px;
  }
`;
