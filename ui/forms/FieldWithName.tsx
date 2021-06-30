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
      <FieldLabel onClick={onLabelClick}>{label}</FieldLabel>
      {children}
    </UIFormField>
  );
})``;

const UIFormField = styled.div`
  display: grid;
  grid-template-rows: auto 42px;
  gap: 8px;
`;
