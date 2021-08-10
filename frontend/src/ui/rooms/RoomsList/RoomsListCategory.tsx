import styled from "styled-components";
import { useBoolean } from "~shared/hooks/useBoolean";
import { CategoryNameLabel } from "~ui/theme/functional";
import { Toggle } from "~ui/toggle";
import { RoomsList } from "./RoomsList";
import { RoomWithActivities } from "./useRoomsWithActivities";

interface Props {
  className?: string;
  rooms: RoomWithActivities[];
  categoryName: string;
  showClosedToggle?: boolean;
}

export const RoomsListCategory = styled(function FilteredRoomsList({
  className,
  rooms,
  categoryName,
  showClosedToggle,
}: Props) {
  const [isShowingClosedRooms, { set: showOnlyClosed, unset: showOnlyOpen }] = useBoolean(false);

  const roomsToShow = rooms.filter(({ room }) => {
    if (!isShowingClosedRooms) {
      return room.finished_at === null;
    }

    return room.finished_at !== null;
  });

  return (
    <UIGroupHolder className={className}>
      <UIHeader>
        <CategoryNameLabel>{categoryName}</CategoryNameLabel>
        {showClosedToggle && (
          <UIClosedRoomsFilter>
            <CategoryNameLabel>Closed</CategoryNameLabel>
            <Toggle size="small" onSet={showOnlyClosed} onUnset={showOnlyOpen} />
          </UIClosedRoomsFilter>
        )}
      </UIHeader>

      <RoomsList rooms={roomsToShow} />
    </UIGroupHolder>
  );
})``;

const UIGroupHolder = styled.div<{}>``;

const UIHeader = styled.div<{}>`
  display: flex;
  margin-bottom: 16px;

  & > ${CategoryNameLabel} {
    flex-grow: 1;
  }
`;

const UIClosedRoomsFilter = styled.div<{}>`
  display: flex;

  ${CategoryNameLabel} {
    margin-right: 8px;
  }
`;
