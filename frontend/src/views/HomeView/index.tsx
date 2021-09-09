import { observer } from "mobx-react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { clientdb } from "~frontend/clientdb";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { CreateRoomButton } from "~frontend/ui/rooms/CreateRoomButton";
import { createSortByLatestActivityFilter } from "~frontend/ui/rooms/filters/factories";
import { RoomsGroupedByActivities } from "~frontend/ui/rooms/RoomsList";
import { ToDoView } from "~frontend/views/ToDoView";

const sortByLatestActivity = createSortByLatestActivityFilter();

export const HomeView = observer(function HomeView() {
  const roomz = clientdb.room.query(() => true).all;
  const user = useAssertCurrentUser();

  // const [rooms = []] = useRoomsQuery({
  //   where: getHomeViewRoomsQueryWhere(user.id),
  // });

  // const [filteredRooms] = useRoomsCriteria(rooms, [sortByLatestActivity]);

  return (
    <div>
      dfsjksdfjklsdfjklsdf
      {roomz.map((room) => {
        return (
          <div key={room.id}>
            ROOM: {room.name} (owner {room.owner?.name})
            <div>
              {room.topics.all.map((topic) => {
                return (
                  <div key={topic.id}>
                    TOPIC: {topic.name}
                    <div>
                      {topic.messages.all.map((message) => {
                        return <div key={message.id}>MESSAGE: {message.id}</div>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

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
});

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
