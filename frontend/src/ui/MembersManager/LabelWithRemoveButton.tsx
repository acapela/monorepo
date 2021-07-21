import { ReactNode } from "react";
import styled from "styled-components";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { IconCross } from "~ui/icons";

interface Props {
  children: ReactNode;
  onRemove: () => void;
}

export const LabelWithRemoveButton = ({ children, onRemove }: Props) => {
  return (
    <UIHolder>
      {children}
      <CircleIconButton onClick={onRemove} icon={<IconCross />} />
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 8px;
`;
