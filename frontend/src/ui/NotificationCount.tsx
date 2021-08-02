import styled from "styled-components";
import { formatNumberWithMaxValue } from "~shared/numbers";
import { theme } from "~ui/theme";

interface Props {
  className?: string;
  value: number;
}

export const NotificationCount = styled<Props>(({ className, value }) => {
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

  /* This extra pixel is needed to make the right font fit */
  padding-bottom: 3px;

  height: 1.25rem;
  min-width: 1.25rem;

  background: ${(props) =>
    props.isHighlighted ? props.theme.colors.interactive.notification : props.theme.colors.interactive.inactive};

  color: #fff;
  ${theme.borderRadius.label}
  ${theme.font.body14.semibold.build}
`;
