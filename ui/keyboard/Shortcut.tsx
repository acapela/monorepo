import { ShortcutCallback, ShortcutDefinition, ShortcutOptions } from "./shortcutBase";
import { ShortcutDescriptor } from "./ShortcutLabel";
import { useShortcut } from "./useShortcut";

interface Props {
  shortcut: ShortcutDefinition;
  callback?: ShortcutCallback;
  options?: ShortcutOptions;
}

export function Shortcut({ shortcut, callback, options }: Props) {
  useShortcut(shortcut, callback, options);

  return <ShortcutDescriptor shortcut={shortcut} />;
}
