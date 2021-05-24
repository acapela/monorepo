import { IconSpaces } from "~ui/icons";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { useSingleSpaceQuery } from "~frontend/gql/spaces";
import { useSingleTopicQuery } from "~frontend/gql/topics";
import { usePathParameter } from "~frontend/utils";

import { BreadcrumbsSegments, BreadcrumbsSegment } from "./BreadcrumbsSegments";

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
      segments.push({ kind: "Space", title: spaceQuery.space.name ?? "", href: "/", icon: <IconSpaces /> });
    }

    if (roomQuery?.room) {
      segments.push({ kind: "Room", title: roomQuery.room.name ?? "", href: "/" });
    }

    if (topicQuery?.topic) {
      segments.push({ kind: "topic", title: topicQuery.topic.name ?? "", href: "/" });
    }

    return segments;
  }

  return <BreadcrumbsSegments segments={getSegments()} />;
}
