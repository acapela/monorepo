import { IconCalendar, IconGrid05, IconHome, IconSpaces } from "~ui/icons";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { useSingleSpaceQuery } from "~frontend/gql/spaces";
import { usePathParameter } from "~frontend/utils";

import { NavItemsBreadcrumbs } from "./NavItemsBreadcrumbs";
import { routes } from "~frontend/routes";
import styled from "styled-components";
import { SpaceGradient } from "~frontend/ui/spaces/spaceGradient";
import { NavItemInfo } from "./NavItem";
import { borderRadius } from "~ui/baseStyles";

const homeSegment: NavItemInfo = {
  title: "Home",
  href: routes.home.path,
  icon: <IconHome />,
};

const calendarSegment: NavItemInfo = {
  title: "Calendar",
  href: routes.calendar.path,
  icon: <IconCalendar />,
};

export function ContentBreadcrumbs() {
  const spaceId = usePathParameter("spaceId");
  const roomId = usePathParameter("roomId");

  const [room] = useSingleRoomQuery({ id: roomId ?? "" }, { skip: !roomId });
  const [space] = useSingleSpaceQuery({ id: spaceId ?? "" }, { skip: !spaceId });

  function getSegments(): NavItemInfo[] {
    const segments: NavItemInfo[] = [];

    segments.push({
      title: "Spaces",
      href: routes.spaces.getUrlWithParams({}),
      icon: <IconSpaces />,
      childItems: [homeSegment, calendarSegment],
    });

    if (space) {
      segments.push({
        title: space.name ?? "",
        href: routes.space.getUrlWithParams({ spaceId: space.id }),
        icon: <BreadcrumbSpaceIcon spaceId={space.id} />,
      });
    }

    if (room) {
      segments.push({
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

  return <NavItemsBreadcrumbs segments={getSegments()} />;
}

const BreadcrumbSpaceIcon = styled(SpaceGradient)`
  height: 24px;
  width: 24px;
  ${borderRadius.label}
`;
