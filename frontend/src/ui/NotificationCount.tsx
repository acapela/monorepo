import styled from "styled-components";
import { formatNumberWithMaxValue } from "~shared/numbers";
import { borderRadius, fontSize } from "~ui/baseStyles";
import { NOTIFICATION_COLOR, STRONG_LINE_COLOR } from "~ui/colors";

interface Props {
  className?: string;
  value: number;
}

export const NotificationCount = styled(({ className, value }: Props) => {
  return (
    <UIHolder isHighlighted={value > 0} className={className}>
      {formatNumberWithMaxValue(value, 9)}
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{ isHighlighted: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;

  height: 1.25rem;
  min-width: 1.25rem;

  background: ${(props) => (props.isHighlighted ? NOTIFICATION_COLOR : STRONG_LINE_COLOR)};

  color: #fff;
  ${borderRadius.label}
  font-size: ${fontSize.label};
  font-weight: bold;
`;
