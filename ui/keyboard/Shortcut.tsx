import React from "react";
import styled from "styled-components";

import { ShortcutCallback, ShortcutDefinition, ShortcutOptions } from "./shortcutBase";
import { ShortcutDescriptor } from "./ShortcutLabel";
import { useShortcut } from "./useShortcut";

interface Props {
  shortcut: ShortcutDefinition;
  callback?: ShortcutCallback;
  options?: ShortcutOptions;
  className?: string;
  noLabel?: boolean;
}

export const Shortcut = styled(function Shortcut({ shortcut, callback, options, className, noLabel }: Props) {
  useShortcut(shortcut, callback, options);

  if (noLabel) return null;

  return <ShortcutDescriptor shortcut={shortcut} className={className} />;
})``;
