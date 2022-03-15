import { addSystemMenuItem, systemMenuItemClicked } from "@aca/desktop/bridge/systemMenu";
import { useMethod } from "@aca/shared/hooks/useMethod";
import { getUUID } from "@aca/shared/uuid";
import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";
import { useEffect } from "react";

interface Props {
  path: string[];
  label: string;
  shortcut?: ShortcutDefinition;
  isChecked?: boolean;
  isDisabled?: boolean;
  onClicked?: () => void;
}

export function SystemMenuItem({ path, label, shortcut, isChecked, onClicked }: Props) {
  const onClickedRef = useMethod(onClicked);

  useEffect(() => {
    const id = getUUID();
    const removeItem = addSystemMenuItem({ id, label, path, shortcut, isChecked });

    const stopListeningForClick = systemMenuItemClicked.subscribe((clickedItem) => {
      if (clickedItem.id !== id) return;

      onClickedRef();
    });

    return () => {
      stopListeningForClick();
      removeItem?.();
    };
  }, [path, label, shortcut, isChecked]);

  return null;
}
