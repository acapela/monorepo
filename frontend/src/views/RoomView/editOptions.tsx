import { gql, useMutation } from "@apollo/client";

import { trackEvent } from "~frontend/analytics/tracking";
import { useDeleteRoom } from "~frontend/gql/rooms";
import { withFragments } from "~frontend/gql/utils";
import { routes } from "~frontend/router";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { EditOptions_RoomFragment, UpdateRoomIsPrivateMutation, UpdateRoomIsPrivateMutationVariables } from "~gql";
import { IconCheck, IconEdit, IconLock, IconTrash, IconUndo, IconUnlock } from "~ui/icons";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";

import { closeOpenTopicsPrompt } from "./RoomCloseModal";

const fragments = {
  room: gql`
    ${closeOpenTopicsPrompt.fragments.room}

    fragment EditOptions_room on room {
      id
      name
      finished_at
      is_private
      space_id
      topics {
        closed_at
      }
      ...RoomCloseModal_room
    }
  `,
};

type Props = {
  room: EditOptions_RoomFragment;
  onEditRoomNameRequest: () => void;
  onCloseRoom: () => void;
};

export const usePopoverEditMenuOptions = withFragments(
  fragments,
  ({ room, onEditRoomNameRequest, onCloseRoom }: Props): PopoverMenuOption[] => {
    const [deleteRoom] = useDeleteRoom();
    const [updateRoomIsPrivate] = useMutation<UpdateRoomIsPrivateMutation, UpdateRoomIsPrivateMutationVariables>(
      gql`
        mutation UpdateRoomIsPrivate($id: uuid!, $isPrivate: Boolean!) {
          room: update_room_by_pk(pk_columns: { id: $id }, _set: { is_private: $isPrivate }) {
            id
            is_private
          }
        }
      `,
      {
        optimisticResponse: (vars) => ({
          __typename: "mutation_root",
          room: { __typename: "room", id: vars.id, is_private: vars.isPrivate },
        }),
      }
    );
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
          updateRoomIsPrivate({ variables: { id: room.id, isPrivate: !room.is_private } });
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

          await deleteRoom({ variables: { id: room.id } });
          trackEvent("Deleted Room", { roomId: room.id });

          await routes.home.push({});
        },
        icon: <IconTrash />,
        isDestructive: true,
      },
    ];
  }
);
