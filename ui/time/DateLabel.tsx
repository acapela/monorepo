import styled from "styled-components";
import { niceFormatDate, niceFormatTime } from "~shared/dates/format";

interface Props {
  date: Date;
  className?: string;
}

export function DateLabel({ date }: Props) {
  return <UIHolder>{niceFormatDate(date)}</UIHolder>;
}

export const TimeLabelWithDateTooltip = styled(function TimeLabelWithDateTooltip({ date, className }: Props) {
  return (
    <UIHolder className={className} data-tooltip={niceFormatDate(date)}>
      {niceFormatTime(date)}
    </UIHolder>
  );
})``;

const UIHolder = styled.span``;
