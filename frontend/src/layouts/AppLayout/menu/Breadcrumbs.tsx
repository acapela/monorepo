import { IconGrid05, IconSpaces } from "~ui/icons";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { useSingleSpaceQuery } from "~frontend/gql/spaces";
import { usePathParameter } from "~frontend/utils";

import { BreadcrumbsSegments, BreadcrumbsSegment } from "./BreadcrumbsSegments";
import { routes } from "~frontend/routes";

export function ContentBreadcrumbs() {
  const spaceId = usePathParameter("spaceId");
  const roomId = usePathParameter("roomId");

  const [room] = useSingleRoomQuery({ id: roomId }, { skip: !roomId });
  const [space] = useSingleSpaceQuery({ id: spaceId }, { skip: !spaceId });

  function getSegments(): BreadcrumbsSegment[] {
    const segments: BreadcrumbsSegment[] = [];

    if (space) {
      segments.push({
        kind: "Space",
        title: space.name ?? "",
        href: routes.space.getUrlWithParams({ spaceId: space.id }),
        icon: <IconSpaces />,
      });
    }

    if (room) {
      segments.push({
        kind: "Room",
        title: room.name ?? "",
        href: routes.spaceRoom.getUrlWithParams({
          spaceId: room.space_id,
          roomId: room.id,
        }),
        icon: <IconGrid05 />,
      });
    }

    return segments;
  }

  return <BreadcrumbsSegments segments={getSegments()} />;
}
