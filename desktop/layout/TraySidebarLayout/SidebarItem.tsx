import React from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

interface Props {
  label: string;
  onClick: () => void;
}

export function SidebarItem({ label, onClick }: Props) {
  return (
    <UIHolder onClick={onClick}>
      <UILabel>{label}</UILabel>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  padding: 12px 12px 12px 72px;
  ${theme.typo.secondaryTitle};
  ${theme.common.clickable};
`;
const UILabel = styled.div``;
