import styled from "styled-components";
import { niceFormatDate, niceFormatTime } from "~shared/dates/format";

interface Props {
  date: Date;
}

export function DateLabel({ date }: Props) {
  return <UIHolder></UIHolder>;
}

export function TimeLabelWithDateTooltip({ date }: Props) {
  return <UIHolder data-tooltip={niceFormatDate(date)}>{niceFormatTime(date)}</UIHolder>;
}

const UIHolder = styled.span``;
