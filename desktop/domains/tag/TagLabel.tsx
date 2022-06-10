import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useRef } from "react";
import styled, { css } from "styled-components";

import { styledObserver } from "@aca/shared/component";
import { useElementHasOverflow } from "@aca/shared/hooks/useElementHasOverflow";
import { useIsElementOrChildHovered } from "@aca/shared/hooks/useIsElementOrChildHovered";
import { PopPresenceAnimator } from "@aca/ui/animations";
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

  const isHovered = useIsElementOrChildHovered(holderRef);

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
      <AnimatePresence>{isHovered && !!count && <UICount>{count}</UICount>}</AnimatePresence>
    </UITag>
  );
})``;

const tagBgBase = theme.colors.layout.backgroundAccent;

const UITag = styled.div<{ $isSelected: boolean; $isClickable: boolean }>`
  border-radius: 6px;
  line-height: 1em;
  padding: 8px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  gap: 8px;
  align-items: center;
  position: relative;
  min-width: 30px;
  ${theme.transitions.hover()}

  ${(props) => (props.$isClickable ? tagBgBase.withBorder.interactive : tagBgBase.asBgWithReadableText)}

  ${(props) =>
    props.$isSelected &&
    css`
      border-color: ${theme.colors.primary.opacity(0.5).value};
    `};
`;

const ICON_SCALE_INCREASE = 0.125;

const UILabel = styled.div`
  ${theme.common.ellipsisText};
  max-width: 130px;
  min-width: 0;
`;

const UIIcon = styled.div<{ $color?: string }>`
  color: ${(props) => props.$color};
  font-size: ${1 + ICON_SCALE_INCREASE}em;
  margin: ${-ICON_SCALE_INCREASE / 2}em;
`;

const UICount = styled(PopPresenceAnimator)`
  position: absolute;
  top: -1em;
  right: -0.75em;
  min-width: 3ch;
  text-align: center;
  font-size: 10px;
  font-weight: bold;
  padding: 4px 2px;
  border-radius: 4px;
  line-height: 1em;
  ${tagBgBase.active.withBorder.asBgWithReadableText};
`;
