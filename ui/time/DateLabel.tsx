import styled from "styled-components";

import { niceFormatTime, relativeFormatDate } from "~shared/dates/format";

interface Props {
  date: Date;
  className?: string;
}

export const TimeLabelWithDateTooltip = styled(function TimeLabelWithDateTooltip({ date, className }: Props) {
  return (
    <UIHolder className={className} data-tooltip={relativeFormatDate(date)}>
      {niceFormatTime(date)}
    </UIHolder>
  );
})``;

const UIHolder = styled.span<{}>``;
