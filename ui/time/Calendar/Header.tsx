import { addMonths, format, isSameMonth, startOfMonth, subMonths } from "date-fns";
import { AnimatePresence } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { PopPresenceAnimator } from "~ui/animations";
import { IconButton } from "~ui/buttons/IconButton";
import { IconCalendar, IconChevronLeft, IconChevronRight } from "~ui/icons";
import { theme } from "~ui/theme";

interface Props {
  currentMonthDate: Date;
  onMonthChange: (newDate: Date) => void;
}

export function Header({ currentMonthDate, onMonthChange }: Props) {
  const monthLabel = format(currentMonthDate, "MMMM Y");
  const now = new Date();

  const canReturnToCurrentMonth = !isSameMonth(now, currentMonthDate);

  const endOfPrevious = startOfMonth(subMonths(currentMonthDate, 1));
  const startOfNext = startOfMonth(addMonths(currentMonthDate, 1));
  return (
    <UIHeader>
      <UIDateTitle>{monthLabel}</UIDateTitle>
      <AnimatePresence>
        {canReturnToCurrentMonth && (
          <PopPresenceAnimator key="fo">
            <IconButton
              kind="primarySubtle"
              tooltip={`Current month - ${format(now, "MMMM")}`}
              icon={<IconCalendar />}
              onClick={() => {
                onMonthChange(startOfMonth(new Date()));
              }}
            />
          </PopPresenceAnimator>
        )}
      </AnimatePresence>

      <IconButton
        kind="primarySubtle"
        tooltip={format(endOfPrevious, "MMMM")}
        icon={<IconChevronLeft />}
        onClick={() => {
          onMonthChange(endOfPrevious);
        }}
      />

      <IconButton
        kind="primarySubtle"
        icon={<IconChevronRight />}
        tooltip={format(startOfNext, "MMMM")}
        onClick={() => {
          onMonthChange(startOfNext);
        }}
      />
    </UIHeader>
  );
}

const UIHeader = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const UIDateTitle = styled.div<{}>`
  ${theme.typo.secondaryTitle};
  flex: 17;
  display: inline-block;
`;
