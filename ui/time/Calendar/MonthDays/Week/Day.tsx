import { format, isSameDay, isSameMonth } from "date-fns";
import React from "react";
import styled, { css } from "styled-components";

import { Button } from "~ui/buttons/Button";
import { ButtonKind } from "~ui/buttons/variants";
import { theme } from "~ui/theme";

interface Props {
  dayDate: Date;
  onSelect: (date: Date) => void;
  currentMonthDate: Date;
  isSelected: boolean;
}

export function Day({ dayDate, onSelect, currentMonthDate, isSelected }: Props) {
  const isTodayDay = isSameDay(dayDate, new Date());
  const isThisDayInCurrentMonth = isSameMonth(currentMonthDate, dayDate);

  function handleDayClick() {
    onSelect?.(dayDate);
  }

  function getButtonKind(): ButtonKind {
    if (isSelected) {
      return "primarySubtle";
    }

    if (isTodayDay) {
      return "backgroundAccent";
    }

    return "transparent";
  }

  return (
    <UIDay>
      <UISquareWrapper>
        <UISquareContent>
          <UIDayButton
            data-tooltip={isTodayDay && "Today"}
            kind={getButtonKind()}
            $isToday={isTodayDay}
            $isSelected={isSelected}
            onClick={handleDayClick}
            isDisabled={!isThisDayInCurrentMonth}
          >
            {format(dayDate, "d")}
          </UIDayButton>
        </UISquareContent>
      </UISquareWrapper>
    </UIDay>
  );
}

const UIDay = styled.div<{}>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const UISquareWrapper = styled.div<{}>`
  padding-bottom: 100%;
  width: 100%;
  position: relative;
`;

const absoluteStretchCss = css`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
`;

const UISquareContent = styled.div<{}>`
  ${absoluteStretchCss};
  display: flex;
  justify-content: stretch;
  align-items: stretch;

  ${Button} {
    padding: 0;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const UIDayButton = styled(Button)<{ $isToday: boolean; $isSelected: boolean }>`
  padding: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  && {
    ${(props) => {
      if (props.isDisabled) {
        return css`
          opacity: 0.4;
        `;
      }

      if (props.$isSelected) {
        return css`
          ${theme.colors.primary.interactive};
          ${theme.colors.primary.readableText.asColor};
        `;
      }

      if (props.$isToday) {
        return css`
          ${theme.colors.primary.asColor};
        `;
      }
    }}
  }
`;
