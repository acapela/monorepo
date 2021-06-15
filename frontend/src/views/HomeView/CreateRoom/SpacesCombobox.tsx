import React from "react";
import styled from "styled-components";
import { SpaceBasicInfoFragment } from "~gql";
import { FieldLabel } from "~ui/typo";
import { UIFormField } from "./UIFormField";

interface Props {
  items: SpaceBasicInfoFragment[];
  onSelect: (itemId: string) => void;
}

export const SpacesCombobox = ({ items, onSelect }: Props) => {
  return (
    <UIFormField>
      <FieldLabel>Select space</FieldLabel>
    </UIFormField>
  );
};
