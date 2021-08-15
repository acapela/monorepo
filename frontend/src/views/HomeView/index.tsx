import styled from "styled-components";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useRoomsQuery } from "~frontend/gql/rooms";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { createSortByLatestActivityFilter } from "~frontend/ui/rooms/filters/factories";
import { useRoomsCriteria } from "~frontend/ui/rooms/filters/filter";
import { RoomsGroupedByActivities } from "~frontend/ui/rooms/RoomsList";
import { getHomeViewRoomsQueryWhere } from "./query";
import { CreateRoomButton } from "~frontend/ui/rooms/CreateRoomButton";
import { clientdb } from "~frontend/clientdb";
import { observer } from "mobx-react";
const sortByLatestActivity = createSortByLatestActivityFilter();

export const HomeView = observer(function HomeView() {
  const roomz = clientdb.room.query(() => true).all;
  const user = useAssertCurrentUser();

  console.log({ roomz });
  // const [rooms = []] = useRoomsQuery({
  //   where: getHomeViewRoomsQueryWhere(user.id),
  // });

  // const [filteredRooms] = useRoomsCriteria(rooms, [sortByLatestActivity]);

  return (
    <div>
      dfsjksdfjklsdfjklsdf
      {roomz.map((room) => {
        console.log("elko", room.name);
        return (
          <div key={room.id}>
            {room.name} (owner {room.owner.name})
          </div>
        );
      })}
    </div>
  );

  return (
    <UIHolder isNarrow>
      <UIContent>
        <RoomsGroupedByActivities rooms={filteredRooms} />
      </UIContent>
      <FlyingCreateRoomButton buttonProps={{ size: "large" }} />
    </UIHolder>
  );
});

const UIHolder = styled(SpacedAppLayoutContainer)<{}>``;

const UIContent = styled.div<{}>`
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
