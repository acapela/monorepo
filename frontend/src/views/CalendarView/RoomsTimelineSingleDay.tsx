import styled from "styled-components";
import { ItemTitle } from "~ui/typo";
import { getDayBoundaries } from "~shared/dates/utils";
import { niceFormatDate } from "~shared/dates/format";
import { useTopicsQuery } from "~frontend/gql/topics";
import { TopicsGrouppedByRooms } from "~frontend/ui/topics/TopicsGrouppedByRooms";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { IconCalendar } from "~ui/icons";
import { motion } from "framer-motion";
import { getSpringTransitionWithDuration } from "~ui/animations";

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
  const [topics = []] = useTopicsQuery({
    where: {
      room: {
        deadline: {
          _gte: dayStart,
          _lte: dayEnd,
        },
      },
    },
  });

  if (!topics?.length && !displayEmpty) {
    return null;
  }

  return (
    <UIHolder
      className={className}
      layoutId={`roomtimeline-${startDate.getTime()}`}
      transition={getSpringTransitionWithDuration(0.6)}
    >
      <UITitle>{niceFormatDate(startDate)}</UITitle>
      <TopicsGrouppedByRooms topics={topics ?? []} />
      {topics?.length === 0 && <EmptyStatePlaceholder description="No topics for this day" icon={<IconCalendar />} />}
    </UIHolder>
  );
})``;

const UIHolder = styled(motion.div)``;

const UITitle = styled(ItemTitle)`
  margin-bottom: 16px;
`;
