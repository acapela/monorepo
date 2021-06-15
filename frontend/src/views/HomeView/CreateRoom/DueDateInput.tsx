import React from "react";
import { FieldLabel } from "~ui/typo";
import { UIFormField } from "./UIFormField";

interface Props {
  value: Date;
  onChange: (value: Date) => void;
}

export const DueDateInput = ({ value, onChange }: Props) => {
  return (
    <UIFormField>
      <FieldLabel>Due date</FieldLabel>
    </UIFormField>
  );
};
