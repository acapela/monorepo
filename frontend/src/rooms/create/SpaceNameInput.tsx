import React from "react";
import { IconSelection } from "~ui/icons";
import { TextInput } from "~ui/forms/TextInput";
import { FieldLabel } from "~ui/typo";
import { UIFormField } from "./UIFormField";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SpaceNameInput = ({ value, onChange }: Props) => {
  return (
    <UIFormField>
      <FieldLabel htmlFor="space-name">Space name</FieldLabel>
      <TextInput
        icon={<IconSelection />}
        id="space-name"
        placeholder="eg. Design team"
        value={value}
        onChange={({ target }) => onChange(target.value)}
      />
    </UIFormField>
  );
};
