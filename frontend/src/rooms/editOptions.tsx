import { createLengthValidator } from "~shared/validation/inputValidation";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { RoomBasicInfoFragment, TopicDetailedInfoFragment } from "~gql";
import { deleteRoom, getSingleRoomQueryManager, updateRoom } from "~frontend/gql/rooms";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { openUIPrompt } from "~frontend/utils/prompt";
import { IconCheck, IconEdit, IconTrash, IconUndo, IconLock, IconUnlock } from "~ui/icons";
import { ModalAnchor } from "~frontend/ui/Modal";
import { closeOpenTopicsPrompt } from "~frontend/views/RoomView/RoomCloseModal";
import { routes } from "~frontend/routes";

export async function handleEditRoomName(room: RoomBasicInfoFragment, anchor?: ModalAnchor) {
  const newName = await openUIPrompt({
    title: "Change room name",
    placeholder: "e.g. Design team, Marketing department, iOS developers...",
    submitLabel: "Change name",
    validateInput: createLengthValidator("Room name", 3),
    initialValue: room.name ?? undefined,
    anchor,
  });

  if (!newName?.trim()) return;

  if (newName === room.name) return;

  await updateRoom({ roomId: room.id, input: { name: newName } });
}

export async function handleDeleteRoom(room: RoomBasicInfoFragment) {
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

  await routes.space.push({ spaceId: room.space_id });

  await deleteRoom({ roomId: room.id });
}

type isRoomOpen = boolean;

async function closeRoom(roomId: string, topics: TopicDetailedInfoFragment[]): Promise<isRoomOpen> {
  const openTopics = topics.filter((topic) => !topic.closed_at);

  if (openTopics.length > 0) {
    const canCloseRoom = await closeOpenTopicsPrompt({ roomId, openTopics });

    if (!canCloseRoom) {
      return true;
    }
  }

  await updateRoom({ roomId, input: { finished_at: new Date().toISOString() } });
  return false;
}

export async function handleToggleCloseRoom(basicRoom: RoomBasicInfoFragment): Promise<isRoomOpen> {
  const roomId = basicRoom.id;
  const detailedRoom = await getSingleRoomQueryManager.fetch({ id: roomId });

  const isOpenRoom = !basicRoom.finished_at;
  if (isOpenRoom) {
    const isRoomStillOpen = await closeRoom(roomId, detailedRoom?.room?.topics ?? []);
    return isRoomStillOpen;
  } else {
    await updateRoom({ roomId, input: { finished_at: null } });
    return true;
  }
}

export async function handleToggleRoomPrivate(room: RoomBasicInfoFragment) {
  const roomId = room.id;
  if (room.is_private) {
    await updateRoom({ roomId, input: { is_private: false } });
  } else {
    await updateRoom({ roomId, input: { is_private: true } });
  }
}

interface GetRoomManagePopoverOptionsConfig {
  onEditRoomNameRequest: () => void;
}

export function getRoomManagePopoverOptions(
  room: RoomBasicInfoFragment,
  config?: GetRoomManagePopoverOptionsConfig
): PopoverMenuOption[] {
  return [
    {
      label: "Edit room name...",
      onSelect: () => {
        if (config?.onEditRoomNameRequest) {
          config.onEditRoomNameRequest();
          return;
        }

        handleEditRoomName(room);
      },
      icon: <IconEdit />,
    },
    {
      label: room.finished_at ? "Reopen room..." : "Close room...",
      onSelect: () => handleToggleCloseRoom(room),
      icon: room.finished_at ? <IconUndo /> : <IconCheck />,
    },
    {
      label: room.is_private ? "Set as public" : "Set as private",
      onSelect: () => handleToggleRoomPrivate(room),
      icon: room.is_private ? <IconUnlock /> : <IconLock />,
    },
    {
      label: "Delete room...",
      onSelect: () => handleDeleteRoom(room),
      icon: <IconTrash />,
      isDestructive: true,
    },
  ];
}
