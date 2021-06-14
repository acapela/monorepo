import { createLengthValidator } from "~shared/validation/inputValidation";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { RoomBasicInfoFragment } from "~gql";
import { deleteRoom, updateRoom } from "~frontend/gql/rooms";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { openUIPrompt } from "~frontend/utils/prompt";
import { IconEdit, IconTrash } from "~ui/icons";
import { ModalAnchor } from "~frontend/ui/Modal";

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

  await deleteRoom({ roomId: room.id });
}

export function getRoomManagePopoverOptions(room: RoomBasicInfoFragment): PopoverMenuOption[] {
  return [
    {
      label: "Edit room name...",
      onSelect: () => handleEditRoomName(room),
      icon: <IconEdit />,
    },
    {
      label: "Delete room...",
      onSelect: () => handleDeleteRoom(room),
      icon: <IconTrash />,
      isDestructive: true,
    },
  ];
}
