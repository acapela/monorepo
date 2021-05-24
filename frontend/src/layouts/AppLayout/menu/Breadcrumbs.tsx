import { IconGrid05, IconNut, IconSpaces } from "~ui/icons";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { useSingleSpaceQuery } from "~frontend/gql/spaces";
import { useSingleTopicQuery } from "~frontend/gql/topics";
import { usePathParameter } from "~frontend/utils";

import { BreadcrumbsSegments, BreadcrumbsSegment } from "./BreadcrumbsSegments";
import { routes } from "~frontend/../routes";

export function ContentBreadcrumbs() {
  const spaceId = usePathParameter("spaceId");
  const roomId = usePathParameter("roomId");
  const topicId = usePathParameter("topicId");

  const [topicQuery] = useSingleTopicQuery({ id: topicId }, { skip: !topicId });
  const [roomQuery] = useSingleRoomQuery({ id: roomId }, { skip: !roomId });
  const [spaceQuery] = useSingleSpaceQuery({ id: spaceId }, { skip: !spaceId });

  function getSegments(): BreadcrumbsSegment[] {
    const segments: BreadcrumbsSegment[] = [];

    if (spaceQuery?.space) {
      segments.push({
        kind: "Space",
        title: spaceQuery.space.name ?? "",
        href: routes.space.getUrlWithParams({ spaceId: spaceQuery.space.id }),
        icon: <IconSpaces />,
      });
    }

    if (roomQuery?.room) {
      segments.push({
        kind: "Room",
        title: roomQuery.room.name ?? "",
        href: routes.spaceRoom.getUrlWithParams({
          spaceId: roomQuery.room.space_id,
          roomId: roomQuery.room.id,
        }),
        icon: <IconGrid05 />,
      });
    }

    if (topicQuery?.topic) {
      segments.push({
        kind: "Topic",
        title: topicQuery.topic.name ?? "",
        href: routes.spaceRoomTopic.getUrlWithParams({
          topicId: topicQuery.topic.id,
          roomId: topicQuery.topic.room.id,
          spaceId: topicQuery.topic.room.space_id,
        }),
        icon: <IconNut />,
      });
    }

    return segments;
  }

  return <BreadcrumbsSegments segments={getSegments()} />;
}
