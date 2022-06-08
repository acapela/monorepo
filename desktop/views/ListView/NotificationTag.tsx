import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { NotificationTag, getTagConfig } from "@aca/desktop/domains/notification/tag";
import { styledObserver } from "@aca/shared/component";
import { useElementHasOverflow } from "@aca/shared/hooks/useElementHasOverflow";
import { theme } from "@aca/ui/theme";

interface Props {
  tag: NotificationTag;
  forceShowLabel?: boolean;
  isSelected?: boolean;
  onClick?: (tag: NotificationTag) => void;
}

export const NotificationTagDisplayer = styledObserver(({ tag, onClick, isSelected, forceShowLabel }: Props) => {
  const labelRef = useRef<HTMLDivElement>(null);
  const { color, icon, label, tooltip } = getTagConfig(tag);

  const hasOverflow = useElementHasOverflow(labelRef);

  function getTooltip() {
    if (tooltip) return tooltip;

    if (!shouldShowLabel) return label;

    if (!hasOverflow) return;

    return label;
  }

  const shouldShowLabel = forceShowLabel || tag.customLabel;

  return (
    <UITag
      data-tooltip={getTooltip()}
      $isClickable={!!onClick}
      $isSelected={isSelected ?? false}
      onClick={() => onClick?.(tag)}
    >
      <UIIcon $color={color}>{icon}</UIIcon>
      {<UILabel ref={labelRef}>{label}</UILabel>}
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
`;

const UIIcon = styled.div<{ $color: string }>`
  color: ${(props) => props.$color};
  font-size: ${1 + ICON_SCALE_INCREASE}em;
  margin: ${-ICON_SCALE_INCREASE / 2}em;
`;
