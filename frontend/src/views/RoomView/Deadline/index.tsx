import React from "react";
import styled from "styled-components";
import { UIText } from "~frontend/../../ui/UIText";
import { RoomDetailedInfoFragment } from "~frontend/gql";

interface Props {
  room: RoomDetailedInfoFragment;
}

export const Deadline = ({ room }: Props) => {
  return (
    <UIHolder>
      <UIText size={15}>{room.deadline}</UIText>
    </UIHolder>
  );
};

const UIHolder = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #eae9ea;
`;
