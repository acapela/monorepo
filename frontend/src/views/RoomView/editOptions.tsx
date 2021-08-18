import { gql } from "@apollo/client";

import { trackEvent } from "~frontend/analytics/tracking";
import { withFragments } from "~frontend/gql/utils";
import { routes } from "~frontend/router";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { DeleteRoomMutationVariables, EditOptions_RoomFragment, UpdateRoomMutationVariables } from "~gql";
import { IconCheck, IconEdit, IconLock, IconTrash, IconUndo, IconUnlock } from "~ui/icons";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";

import { closeOpenTopicsPrompt } from "./RoomCloseModal";

export const getRoomManagePopoverOptions = withFragments(
  {
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
  },
  ({
    room,
    onEditRoomNameRequest,
    onUpdateRoom,
    onDeleteRoom,
  }: {
    room: EditOptions_RoomFragment;
    onEditRoomNameRequest: () => void;
    onUpdateRoom: (vars: UpdateRoomMutationVariables) => void;
    onDeleteRoom: (vars: DeleteRoomMutationVariables) => void;
  }): PopoverMenuOption[] => [
    {
      label: "Edit room name...",
      onSelect: () => {
        onEditRoomNameRequest();
      },
      icon: <IconEdit />,
    },

    {
      label: room.finished_at ? "Reopen room..." : "Close room...",
      onSelect: async () => {
        const roomId = room.id;

        if (room.finished_at) {
          onUpdateRoom({ id: roomId, input: { finished_at: null } });
          trackEvent("Reopened Room", { roomId });
          return;
        }
        const openTopics = room.topics.filter((topic) => !topic.closed_at);

        if (openTopics.length > 0) {
          const canCloseRoom = await closeOpenTopicsPrompt(room);
          if (!canCloseRoom) {
            return;
          }
        }

        onUpdateRoom({ id: roomId, input: { finished_at: new Date().toISOString() } });
        trackEvent("Closed Room", { roomId, hasRoomOpenTopics: openTopics.length > 0 });
      },
      icon: room.finished_at ? <IconUndo /> : <IconCheck />,
    },
    {
      label: room.is_private ? "Set as public" : "Set as private",
      onSelect: () => {
        onUpdateRoom({ id: room.id, input: { is_private: !room.is_private } });
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

        await onDeleteRoom({ id: room.id });
        trackEvent("Deleted Room", { roomId: room.id });

        await routes.space.push({ spaceId: room.space_id });
      },
      icon: <IconTrash />,
      isDestructive: true,
    },
  ]
);
