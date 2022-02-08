import { AnimatePresence } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { createChannel } from "@aca/shared/channel";
import { createDocumentEvent, createWindowEvent, useElementEvent } from "@aca/shared/domEvents";
import { useDebouncedBoolean } from "@aca/shared/hooks/useDebouncedValue";
import { useId } from "@aca/shared/id";

import { TooltipLabel, TooltipLabelProps } from "./TooltipLabel";

/**
 * Having shared channel instead of 'isOpen' local state ensures there is never more than 1 tooltips opened at once
 */
const activeTooltipIdChannel = createChannel<string | null>();

createDocumentEvent("blur", () => {
  activeTooltipIdChannel.publish(null);
});

createWindowEvent(
  "scroll",
  () => {
    activeTooltipIdChannel.publish(null);
  },
  { capture: true }
);

export const Tooltip = styled<TooltipLabelProps>((props) => {
  const id = useId();

  const isActive = activeTooltipIdChannel.useLastValueSelector<boolean>((activeTooltipId) => activeTooltipId === id);

  const shouldRender = useDebouncedBoolean(isActive, { onDelay: 150, offDelay: 0 });

  useElementEvent(
    props.anchorRef,
    "mouseenter",
    () => {
      activeTooltipIdChannel.publish(id);
    },
    {}
  );

  useElementEvent(
    props.anchorRef,
    "mouseleave",
    () => {
      activeTooltipIdChannel.publish(null);
    },
    { isEnabled: isActive }
  );

  return <AnimatePresence>{shouldRender && <TooltipLabel {...props} />}</AnimatePresence>;
})``;
