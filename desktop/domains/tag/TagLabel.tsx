import React, { ReactNode, useRef } from "react";
import styled, { css } from "styled-components";

import { UICountIndicator } from "@aca/desktop/ui/CountIndicator";
import { styledObserver } from "@aca/shared/component";
import { useElementHasOverflow } from "@aca/shared/hooks/useElementHasOverflow";
import { theme } from "@aca/ui/theme";

interface Props {
  label: string;
  color?: string;
  icon?: ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  tooltip?: string;
  count?: number;
}

export const TagLabel = styledObserver(({ label, color, icon, onClick, isSelected, tooltip, count }: Props) => {
  const holderRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const hasOverflow = useElementHasOverflow(labelRef);

  function getTooltip() {
    if (tooltip) return tooltip;

    if (!hasOverflow) return;

    return label;
  }

  return (
    <UITag
      ref={holderRef}
      data-tooltip={getTooltip()}
      $isClickable={!!onClick}
      $isSelected={isSelected ?? false}
      onClick={onClick}
    >
      <UIIcon $color={color}>{icon}</UIIcon>
      {<UILabel ref={labelRef}>{label}</UILabel>}
      {!!count && <UICount>{count}</UICount>}
    </UITag>
  );
})``;

const tagBgBase = theme.colors.layout.backgroundAccent;

const UITag = styled.div<{ $isSelected: boolean; $isClickable: boolean }>`
  ${theme.box.items.selectItem.size.padding.radius};
  ${theme.typo.bodyTitle};
  display: flex;
  gap: 8px;
  align-items: center;
  position: relative;
  min-width: 30px;
  ${theme.transitions.hover()}

  ${(props) => (props.$isClickable ? tagBgBase.withBorder.interactive : tagBgBase.withBorder.asBgWithReadableText)}

  ${(props) =>
    props.$isSelected &&
    css`
      border-color: ${theme.colors.primary.opacity(0.5).value};
    `};
`;

const UILabel = styled.div`
  ${theme.common.ellipsisText};
  max-width: 130px;
  min-width: 0;
`;

const UIIcon = styled.div<{ $color?: string }>`
  color: ${(props) => props.$color};
  ${theme.iconSize.item};
`;

const UICount = styled(UICountIndicator)``;
