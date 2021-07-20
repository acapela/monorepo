import { ReactNode } from "react";
import styled from "styled-components";
import { TextH3 } from "~ui/typo";
import { borderRadius, shadow } from "~ui/baseStyles";
import { WHITE } from "~ui/colors";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { IconCross } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";

interface Props {
  title: string;
  children: ReactNode;
  onClose?: () => void;
}

export const MembersManagerContainer = ({ title, children, onClose }: Props) => {
  useShortcut("Escape", () => {
    onClose?.();
  });

  return (
    <UIHolder>
      <UIHeader>
        <TextH3 spezia>{title}</TextH3>
        {onClose && <CircleIconButton size="medium" icon={<IconCross />} onClick={onClose} />}
      </UIHeader>
      {children}
    </UIHolder>
  );
};

const UIHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px;

  background: ${WHITE};
  ${borderRadius.modal};
  ${shadow.popover}

  width: 534px;
  @media (max-width: 560px) {
    width: 100%;
  }
`;
