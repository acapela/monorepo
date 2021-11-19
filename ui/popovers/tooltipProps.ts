import { RefObject } from "react";

import { getElementAttribute, useDOMAttributeValue } from "~shared/hooks/useElementAttribute";
import { ShortcutDefinition } from "~ui/keyboard/shortcutBase";

const TOOLTIP_LABEL_ATTRIBUTE = "data-tooltip";
const TOOLTIP_SHORTCUT_ATTRIBUTE = "data-tooltip-shortcut";

export interface TooltipProps {
  [TOOLTIP_LABEL_ATTRIBUTE]?: string;
  [TOOLTIP_SHORTCUT_ATTRIBUTE]?: string;
}

interface TooltipConfig {
  label?: string | null;
  shortcut?: ShortcutDefinition | null;
}

export function getTooltipProps(input: TooltipConfig): TooltipProps {
  const props: TooltipProps = {};

  if (input.label) {
    props[TOOLTIP_LABEL_ATTRIBUTE] = input.label;
  }

  if (input.shortcut) {
    props[TOOLTIP_SHORTCUT_ATTRIBUTE] = JSON.stringify(input.shortcut);
  }

  return props;
}

function parseShortcutRaw(input: unknown): ShortcutDefinition | null {
  if (typeof input !== "string") return null;

  return JSON.parse(input);
}

export function parseTooltipProps(props: TooltipProps): TooltipConfig {
  const input: TooltipConfig = {};

  if (props["data-tooltip"]) {
    input.label = props["data-tooltip"];
  }

  if (props["data-tooltip-shortcut"]) {
    input.shortcut = JSON.parse(props["data-tooltip-shortcut"]);
  }

  return input;
}

export function useElementTooltipConfig(element: RefObject<HTMLElement>): TooltipConfig | null {
  const label = useDOMAttributeValue(element, TOOLTIP_LABEL_ATTRIBUTE) as string | null;
  const shortcutRaw = useDOMAttributeValue(element, TOOLTIP_SHORTCUT_ATTRIBUTE);

  const shortcut = parseShortcutRaw(shortcutRaw);

  if (!label && !shortcut) return null;

  return {
    label,
    shortcut,
  };
}

function getIsElementTooltipHost(element: HTMLElement): boolean {
  const label = getElementAttribute(element, TOOLTIP_LABEL_ATTRIBUTE);
  const shortcutInfo = getElementAttribute(element, TOOLTIP_SHORTCUT_ATTRIBUTE);

  return !!label || !!shortcutInfo;
}

/**
 * Will try to find tooltip info including all parents of given element.
 */
export function getClosestElementTooltipHost(element: HTMLElement): HTMLElement | null {
  let currentCandidate: HTMLElement | null = element;

  while (currentCandidate) {
    if (getIsElementTooltipHost(currentCandidate)) {
      return currentCandidate;
    }

    currentCandidate = currentCandidate.parentElement;
  }

  return null;
}
