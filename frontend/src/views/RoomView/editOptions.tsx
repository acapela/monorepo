import { trackEvent } from "~frontend/analytics/tracking";
import { RoomEntity } from "~frontend/clientdb/room";
import { routes } from "~frontend/router";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { IconCheck, IconEdit, IconLock, IconTrash, IconUndo, IconUnlock } from "~ui/icons";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";

type Props = {
  room: RoomEntity;
  onEditRoomNameRequest: () => void;
  onCloseRoom: () => void;
};

export const getPopoverEditMenuOptions = ({ room, onEditRoomNameRequest, onCloseRoom }: Props): PopoverMenuOption[] => {
  return [
    {
      label: "Edit room name...",
      onSelect: () => {
        onEditRoomNameRequest();
      },
      icon: <IconEdit />,
    },

    {
      label: room.finished_at ? "Reopen room..." : "Close room...",
      onSelect: onCloseRoom,
      icon: room.finished_at ? <IconUndo /> : <IconCheck />,
    },
    {
      label: room.is_private ? "Set as public" : "Set as private",
      onSelect: () => {
        room.update({ is_private: !room.is_private });
        trackEvent(room.is_private ? "Made Room Public" : "Made Room Private", { roomId: room.id });
      },
      icon: room.is_private ? <IconUnlock /> : <IconLock />,
    },

    {
      label: "Delete room...",
      onSelect: async () => {
        routes.space.prefetch({ spaceId: room.space_id });

        const didConfirm = await openConfirmPrompt({
          title: `Remove room`,
          description: (
            <>
              Are you sure you want to remove room <strong>{room.name}</strong>
            </>
          ),
          confirmLabel: `Remove`,
        });

        if (!didConfirm) return;

        room.remove();
        trackEvent("Deleted Room", { roomId: room.id });

        await routes.space.push({ spaceId: room.space_id });
      },
      icon: <IconTrash />,
      isDestructive: true,
    },
  ];
};
