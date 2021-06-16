import React from "react";
import styled from "styled-components";
import { fontSize } from "~frontend/../../ui/baseStyles";
import { TextInput } from "~frontend/../../ui/forms/TextInput";
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
      <UITextInput
        id="space-name"
        placeholder="eg. Design team"
        value={value}
        onChange={({ target }) => onChange(target.value)}
      />
    </UIFormField>
  );
};

const UITextInput = styled(TextInput)`
  height: 100%;
  font-size: ${fontSize.label};
`;
