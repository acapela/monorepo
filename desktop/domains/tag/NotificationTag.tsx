import React, { useRef } from "react";

import { styledObserver } from "@aca/shared/component";
import { useElementHasOverflow } from "@aca/shared/hooks/useElementHasOverflow";

import { NotificationTag, getTagConfig } from "./tag";
import { TagLabel } from "./TagLabel";

interface Props {
  tag: NotificationTag;
  forceShowLabel?: boolean;
  isSelected?: boolean;
  onClick?: (tag: NotificationTag) => void;
  count?: number;
  tooltip?: string;
}

export const NotificationTagDisplayer = styledObserver(
  ({ tag, onClick, isSelected, forceShowLabel, count, tooltip: forcedTooltip }: Props) => {
    const labelRef = useRef<HTMLDivElement>(null);
    const { color, icon, label, tooltip } = getTagConfig(tag);

    const hasOverflow = useElementHasOverflow(labelRef);

    function getTooltip() {
      if (forcedTooltip) return forcedTooltip;

      if (tooltip) return tooltip;

      if (!shouldShowLabel) return label;

      if (!hasOverflow) return;

      return label;
    }

    const shouldShowLabel = forceShowLabel || tag.customLabel;

    return (
      <TagLabel
        tooltip={getTooltip()}
        isSelected={isSelected}
        onClick={onClick ? () => onClick?.(tag) : undefined}
        icon={icon}
        label={label}
        color={color}
        count={count}
      />
    );
  }
)``;
