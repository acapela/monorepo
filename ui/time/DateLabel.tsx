import styled from "styled-components";
import { niceFormatDate, niceFormatTime, relativeFormatDate } from "~shared/dates/format";

interface Props {
  date: Date;
  className?: string;
}

export function DateLabel({ date }: Props) {
  return <UIHolder>{niceFormatDate(date)}</UIHolder>;
}

export const TimeLabelWithDateTooltip = styled(function TimeLabelWithDateTooltip({ date, className }: Props) {
  return (
    <UIHolder className={className} data-tooltip={relativeFormatDate(date)}>
      {niceFormatTime(date)}
    </UIHolder>
  );
})``;

const UIHolder = styled.span<{}>``;
