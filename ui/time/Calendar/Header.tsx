import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import React from "react";
import styled from "styled-components";

import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconChevronLeft, IconChevronRight } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

interface Props {
  currentMonthDate: Date;
  onMonthChange: (newDate: Date) => void;
}

export function Header({ currentMonthDate, onMonthChange }: Props) {
  const monthLabel = format(currentMonthDate, "MMMM Y");

  const endOfPrevious = startOfMonth(subMonths(currentMonthDate, 1));
  const startOfNext = startOfMonth(addMonths(currentMonthDate, 1));
  return (
    <UIHeader>
      <UIDateTitle>{monthLabel}</UIDateTitle>
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
  ${theme.typo.content.bold};
  flex: 17;
  display: inline-block;
`;
