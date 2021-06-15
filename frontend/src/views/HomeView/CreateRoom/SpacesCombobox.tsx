import React from "react";
import { SpaceBasicInfoFragment } from "~gql";

interface Props {
  items: SpaceBasicInfoFragment[];
  onSelect: (itemId: string) => void;
}

export const SpacesCombobox = ({ items, onSelect }: Props) => {
  return <p>SpaceCombobox will be here</p>;
};
