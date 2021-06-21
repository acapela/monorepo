import { IconCalendar, IconHome, IconSpaces } from "~ui/icons";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { usePreferredSpaces, useSingleSpaceQuery } from "~frontend/gql/spaces";
import { usePathParameter } from "~frontend/utils";
import { NavItemsBreadcrumbs } from "./NavItemsBreadcrumbs";
import { routes } from "~frontend/routes";
import styled from "styled-components";
import { SpaceGradient } from "~frontend/ui/spaces/spaceGradient";
import { NavItemInfo } from "./NavItem";
import { borderRadius } from "~ui/baseStyles";

const homeSegment: NavItemInfo = {
  key: "home",
  title: "Home",
  href: routes.home.path,
  icon: <IconHome />,
};

const calendarSegment: NavItemInfo = {
  key: "calendar",
  title: "Calendar",
  href: routes.calendar.path,
  icon: <IconCalendar />,
};

export function ContentBreadcrumbs() {
  const spaceId = usePathParameter("spaceId");
  const roomId = usePathParameter("roomId");

  const [room] = useSingleRoomQuery({ id: roomId ?? "" }, { skip: !roomId });
  const [space] = useSingleSpaceQuery({ id: spaceId ?? "" }, { skip: !spaceId });

  const spaces = usePreferredSpaces(11);

  function getSegments(): NavItemInfo[] {
    const segments: NavItemInfo[] = [];

    segments.push({
      key: "spaces",
      title: "Spaces",
      href: routes.spaces.getUrlWithParams({}),
      icon: <IconSpaces />,
      childItems: [homeSegment, calendarSegment],
    });

    if (space) {
      const otherSpaces = spaces.filter((otherSpace) => otherSpace.id !== space.id);

      segments.push({
        title: space.name ?? "",
        href: routes.space.getUrlWithParams({ spaceId: space.id }),
        key: space.id,
        icon: <BreadcrumbSpaceIcon spaceId={space.id} />,
        childItems: otherSpaces.map((otherSpace) => {
          return {
            key: otherSpace.id,
            title: otherSpace.name ?? "",
            href: routes.space.getUrlWithParams({ spaceId: otherSpace.id }),
            icon: <BreadcrumbSpaceIcon spaceId={otherSpace.id} />,
          };
        }),
      });
    }

    if (room) {
      segments.push({
        key: room.id,
        title: room.name ?? "",
        href: routes.spaceRoom.getUrlWithParams({
          // TODO: space_id should not be nullable in hasura
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          spaceId: room.space_id!,
          roomId: room.id,
        }),
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
