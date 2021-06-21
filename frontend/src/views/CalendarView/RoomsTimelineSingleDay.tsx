import styled from "styled-components";
import { ItemTitle } from "~ui/typo";
import { getDayBoundaries } from "~shared/dates/utils";
import { niceFormatDate } from "~shared/dates/format";
import { RoomsList } from "~frontend/ui/rooms/RoomsList";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { IconCalendar } from "~ui/icons";
import { motion } from "framer-motion";
import { getSpringTransitionWithDuration } from "~ui/animations";
import { useRoomsQuery } from "~frontend/gql/rooms";

interface Props {
  startDate: Date;
  className?: string;
  displayEmpty?: boolean;
}

export const RoomsTimelineSingleDay = styled(function RoomsTimelineSingleDay({
  startDate,
  className,
  displayEmpty,
}: Props) {
  const [dayStart, dayEnd] = getDayBoundaries(startDate);
  const [rooms = []] = useRoomsQuery({
    where: {
      deadline: {
        _gte: dayStart.toISOString(),
        _lte: dayEnd.toISOString(),
      },
    },
  });

  // If there are no topics in given day render empty component unless forced to render empty.
  if (!rooms?.length && !displayEmpty) {
    return null;
  }

  return (
    <UIHolder
      className={className}
      layoutId={`roomtimeline-${startDate.getTime()}`}
      transition={getSpringTransitionWithDuration(0.6)}
    >
      <UITitle>{niceFormatDate(startDate)}</UITitle>
      <RoomsList rooms={rooms} />
      {rooms?.length === 0 && <EmptyStatePlaceholder description="No topics for this day" icon={<IconCalendar />} />}
    </UIHolder>
  );
})``;

const UIHolder = styled(motion.div)``;

const UITitle = styled(ItemTitle)`
  margin-bottom: 16px;
`;
