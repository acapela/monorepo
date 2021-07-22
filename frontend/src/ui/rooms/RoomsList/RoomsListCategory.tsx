import styled from "styled-components";
import { RoomDetailedInfoFragment, RoomsQueryVariables } from "~gql";
import { RoomsList } from "./RoomsList";
import { useRoomsQuery } from "~frontend/gql/rooms";
import { groupByFilter } from "~frontend/../../shared/groupByFilter";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { CategoryNameLabel } from "~frontend/../../ui/theme/functional";
import { Toggle } from "~frontend/../../ui/toggle";
import { useBoolean } from "~frontend/../../shared/hooks/useBoolean";

interface Props {
  className?: string;
  rooms: RoomDetailedInfoFragment[];
  categoryName: string;
  showClosedToggle?: boolean;
}

export const RoomsListCategory = styled(function FilteredRoomsList({
  className,
  rooms,
  categoryName,
  showClosedToggle,
}: Props) {
  const [isShowingClosed, { set: showClosed, unset: dontShowClosed }] = useBoolean(false);

  const roomsToShow = rooms.filter((room) => {
    if (!isShowingClosed) {
      return room.finished_at === null;
    }

    return room.finished_at !== null;
  });
  return (
    <UIGroupHolder className={className}>
      <UIHeader>
        <CategoryNameLabel>{categoryName}</CategoryNameLabel>
        <UIClosedRoomsFilter>
          <CategoryNameLabel>Closed</CategoryNameLabel>
          <Toggle size="small" onSet={showClosed} onUnset={dontShowClosed} label="Closed" />
        </UIClosedRoomsFilter>
      </UIHeader>

      <RoomsList rooms={roomsToShow} />
    </UIGroupHolder>
  );
})``;

const UIGroupHolder = styled.div``;

const UIHeader = styled.div`
  display: flex;
  margin-bottom: 16px;

  & > ${CategoryNameLabel} {
    flex-grow: 1;
  }
`;

const UIClosedRoomsFilter = styled.div`
  display: flex;

  ${CategoryNameLabel} {
    margin-right: 8px;
  }
`;
