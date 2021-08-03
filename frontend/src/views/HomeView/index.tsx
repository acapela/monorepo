import styled from "styled-components";
import { Room_Bool_Exp } from "~gql";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useRoomsQuery } from "~frontend/gql/rooms";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { createSortByLatestActivityFilter } from "~frontend/ui/rooms/filters/factories";
import { useRoomsCriteria } from "~frontend/ui/rooms/filters/filter";
import { RoomsGroupedByActivities } from "~frontend/ui/rooms/RoomsList";
import { CreateRoomButton } from "./CreateRoomButton";

const sortByLatestActivity = createSortByLatestActivityFilter();

export function getHomeViewRoomsQueryWhere(userId: string): Room_Bool_Exp {
  return {
    finished_at: { _is_null: true },
    members: { user_id: { _eq: userId } },
  };
}

export function HomeView() {
  const user = useAssertCurrentUser();

  const [rooms = []] = useRoomsQuery({
    where: getHomeViewRoomsQueryWhere(user.id),
  });

  const [filteredRooms] = useRoomsCriteria(rooms, [sortByLatestActivity]);

  return (
    <UIHolder isNarrow>
      <UIContent>
        <RoomsGroupedByActivities rooms={filteredRooms} />
      </UIContent>
      <FlyingCreateRoomButton />
    </UIHolder>
  );
}

const UIHolder = styled(SpacedAppLayoutContainer)<{}>``;

const UIContent = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  ${RoomsGroupedByActivities} {
    margin-top: 40px;
    width: 100%;
  }
`;

const FlyingCreateRoomButton = styled(CreateRoomButton)<{}>`
  position: absolute;
  bottom: 24px;
  right: 24px;
`;
