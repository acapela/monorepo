import { format } from "date-fns";
import React, { useMemo } from "react";
import styled from "styled-components";
import { hoverActionCss } from "~ui/transitions";
import { UIText } from "~ui/UIText";
import { RoomDetailedInfoFragment } from "~frontend/gql";

interface Props {
  room: RoomDetailedInfoFragment;
}

export const Deadline = ({ room }: Props) => {
  const { deadline } = room;
  const formattedDeadline = useMemo(() => format(new Date(deadline), "dd.MM.yyyy, p"), [deadline]);
  return (
    <UIHolder>
      <UIText size={15}>{formattedDeadline}</UIText>
    </UIHolder>
  );
};

const UIHolder = styled.div`
  ${hoverActionCss}
  padding: 8px 16px;
  cursor: pointer;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #eae9ea;
`;
