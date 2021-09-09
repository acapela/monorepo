import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useRoomsQuery } from "~frontend/gql/rooms";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { CreateRoomButton } from "~frontend/ui/rooms/CreateRoomButton";
import { createSortByLatestActivityFilter } from "~frontend/ui/rooms/filters/factories";
import { useRoomsCriteria } from "~frontend/ui/rooms/filters/filter";
import { RoomsGroupedByActivities } from "~frontend/ui/rooms/RoomsList";
import { ToDoView } from "~frontend/views/ToDoView";

import { getHomeViewRoomsQueryWhere } from "./query";

const sortByLatestActivity = createSortByLatestActivityFilter();

export function HomeView() {
  const user = useAssertCurrentUser();

  const [rooms = []] = useRoomsQuery({
    where: getHomeViewRoomsQueryWhere(user.id),
  });

  if (typeof window !== "undefined") throw new Error("ja lol");
  const [filteredRooms] = useRoomsCriteria(rooms, [sortByLatestActivity]);

  return (
    <UIHolder isNarrow>
      <UIColumns>
        <ToDoView />
        <UIRooms>
          <RoomsGroupedByActivities rooms={filteredRooms} />
        </UIRooms>
      </UIColumns>

      <FlyingCreateRoomButton buttonProps={{ size: "large" }} />
    </UIHolder>
  );
}

const UIHolder = styled(SpacedAppLayoutContainer)<{}>``;

const UIColumns = styled.div<{}>`
  grid-gap: 32px;
`;

const UIRooms = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  ${RoomsGroupedByActivities} {
    margin: 40px 0;
    width: 100%;
  }
`;

const FlyingCreateRoomButton = styled(CreateRoomButton)<{}>`
  position: absolute;
  bottom: 24px;
  right: 24px;
`;
