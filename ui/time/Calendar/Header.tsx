import { addMonths, format, isSameMonth, startOfMonth, subMonths } from "date-fns";
import { AnimatePresence } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { PopPresenceAnimator } from "~ui/animations";
import { WideIconButton } from "~ui/buttons/WideIconButton";
import { IconCalendar, IconChevronLeft, IconChevronRight } from "~ui/icons";
import { TextH6 } from "~ui/typo";

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
      <UIDateTitle spezia medium>
        {monthLabel}
      </UIDateTitle>
      <AnimatePresence>
        {canReturnToCurrentMonth && (
          <PopPresenceAnimator key="fo">
            <WideIconButton
              tooltip={`Current month - ${format(now, "MMMM")}`}
              icon={<IconCalendar />}
              onClick={() => {
                onMonthChange(startOfMonth(new Date()));
              }}
            />
          </PopPresenceAnimator>
        )}
      </AnimatePresence>

      <WideIconButton
        tooltip={format(endOfPrevious, "MMMM")}
        icon={<IconChevronLeft />}
        onClick={() => {
          onMonthChange(endOfPrevious);
        }}
      />

      <WideIconButton
        icon={<IconChevronRight />}
        tooltip={format(startOfNext, "MMMM")}
        onClick={() => {
          onMonthChange(startOfNext);
        }}
      />
    </UIHeader>
  );
}

const UIHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const UIDateTitle = styled(TextH6)`
  flex: 17;
  display: inline-block;
`;
