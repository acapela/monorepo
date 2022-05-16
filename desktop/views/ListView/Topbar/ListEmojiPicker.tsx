import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import { useRef, useState } from "react";

import { NotificationListEntity } from "@aca/desktop/clientdb/list";
import { useContextMenu } from "@aca/desktop/domains/contextMenu/useContextMenu";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { EmojiPickerPopover } from "@aca/ui/emoji/EmojiPicker/EmojiPickerPopover";
import { IconFolder } from "@aca/ui/icons";

interface Props {
  list: NotificationListEntity;
}

export const ListEmojiPicker = observer(({ list }: Props) => {
  const holderRef = useRef<HTMLDivElement>(null);

  const [isPickingEmoji, setIsPickingEmoji] = useState(false);

  useContextMenu(holderRef, () => [
    {
      label: "Remove emoji",
      enabled: !!list.emoji,
      onSelected() {
        list.update({ emoji: null });
      },
    },
  ]);

  return (
    <div ref={holderRef}>
      <IconButton
        size="compact"
        icon={<>{list.emoji ?? <IconFolder />}</>}
        onClick={() => {
          setIsPickingEmoji(true);
        }}
        tooltip="Pick list emoji"
      />
      <AnimatePresence>
        {isPickingEmoji && (
          <EmojiPickerPopover
            anchorRef={holderRef}
            onEmojiPicked={(emoji) => {
              list.update({ emoji });
              setIsPickingEmoji(false);
            }}
            onCloseRequest={() => {
              setIsPickingEmoji(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
});
