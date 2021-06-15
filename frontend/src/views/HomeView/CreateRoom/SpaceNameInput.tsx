import React from "react";
import { FieldLabel } from "~ui/typo";
import { UIFormField } from "./UIFormField";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SpaceNameInput = ({ value, onChange }: Props) => {
  return (
    <UIFormField>
      <FieldLabel>Space name</FieldLabel>
    </UIFormField>
  );
};
