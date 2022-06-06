import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";

import { useContextMenu } from "@aca/desktop/domains/contextMenu/useContextMenu";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { EmojiPickerPopover } from "@aca/ui/emoji/EmojiPicker/EmojiPickerPopover";
import { IconFolder } from "@aca/ui/icons";

interface Props {
  list: NotificationsList;
}

export const ListEmojiPicker = observer(({ list }: Props) => {
  const holderRef = useRef<HTMLDivElement>(null);

  const [isPickingEmoji, setIsPickingEmoji] = useState(false);

  const listEntity = list.listEntity;

  const canPick = !!listEntity && !listEntity.isSystemList;

  useContextMenu(holderRef, () => [
    {
      label: "Remove emoji",
      enabled: !!listEntity?.emoji,
      onSelected() {
        listEntity?.update({ emoji: null });
      },
    },
  ]);

  return (
    <UIHolder ref={holderRef} $disable={!canPick}>
      <IconButton
        size="compact"
        icon={<>{list.icon ?? <IconFolder />}</>}
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
              listEntity?.update({ emoji });
              setIsPickingEmoji(false);
            }}
            onCloseRequest={() => {
              setIsPickingEmoji(false);
            }}
          />
        )}
      </AnimatePresence>
    </UIHolder>
  );
});

const UIHolder = styled.div<{ $disable: boolean }>`
  ${(props) =>
    props.$disable &&
    css`
      pointer-events: none;
    `}
`;
