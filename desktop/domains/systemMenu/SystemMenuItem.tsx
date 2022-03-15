import { useEffect } from "react";

import { addSystemMenuItem, systemMenuItemClicked } from "@aca/desktop/bridge/systemMenu";
import { useMethod } from "@aca/shared/hooks/useMethod";
import { getUUID } from "@aca/shared/uuid";
import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";

import { useSystemMenuGroup } from "./SystemMenuGroup";

interface Props {
  path: string[];
  label: string;
  shortcut?: ShortcutDefinition;
  isChecked?: boolean;
  isDisabled?: boolean;
  onClicked?: () => void;
  group?: string;
}

export function SystemMenuItem({ path, label, shortcut, isChecked, isDisabled, onClicked, group }: Props) {
  const groupFromContext = useSystemMenuGroup();
  const onClickedRef = useMethod(onClicked);

  const finalGroup = groupFromContext ?? group ?? undefined;

  useEffect(() => {
    const id = getUUID();
    const removeItem = addSystemMenuItem({ id, label, path, shortcut, isChecked, isDisabled, group: finalGroup });

    const stopListeningForClick = systemMenuItemClicked.subscribe((clickedItem) => {
      if (clickedItem.id !== id) return;

      onClickedRef();
    });

    return () => {
      stopListeningForClick();
      removeItem?.();
    };
  }, [path, label, shortcut, isChecked, isDisabled, finalGroup]);

  return null;
}
