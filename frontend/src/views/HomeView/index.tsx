import { observer } from "mobx-react";
import styled from "styled-components";
import { clientdb } from "~frontend/clientdb";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { CreateRoomButton } from "~frontend/ui/rooms/CreateRoomButton";
import { createSortByLatestActivityFilter } from "~frontend/ui/rooms/filters/factories";
import { RoomsGroupedByActivities } from "~frontend/ui/rooms/RoomsList";
const sortByLatestActivity = createSortByLatestActivityFilter();

export const HomeView = observer(function HomeView() {
  const rooms = clientdb.room.query().all;

  return (
    <div>
      All rooms
      {rooms.map((room) => {
        return (
          <div key={room.id}>
            Room:
            {room.name}
            (owner {room.owner?.name} - {room.owner?.id})
            <div>
              Topics
              <div>
                {room.topics.all.map((topic) => {
                  return (
                    <div>
                      Topic name: {topic.name}
                      <div>
                        <div>messages:</div>
                        {topic.messages.all.map((message) => {
                          return (
                            <div>
                              Message by {message.user?.email}
                              <pre>{JSON.stringify(message.content)}</pre>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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

const UIHolder = styled(SpacedAppLayoutContainer)<{}>`
  pre {
    font-family: monospace !important;
    font-size: 10px;
  }
`;

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
