import { ReactNode } from "react";
import styled from "styled-components";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { theme } from "~ui/theme";
import { TextH3 } from "~ui/typo";

interface Props {
  title: string;
  children: ReactNode;
  onClose?: () => void;
}

export const PanelWithTopbarAndCloseButton = ({ title, children, onClose }: Props) => {
  useShortcut("Escape", onClose, { isEnabled: Boolean(onClose) });

  return (
    <UIHolder>
      <UIHeader>
        <TextH3 spezia>{title}</TextH3>
        {onClose && <CircleCloseIconButton onClick={onClose} />}
      </UIHeader>
      {children}
    </UIHolder>
  );
};

const UIHeader = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px;

  background: ${theme.colors.layout.foreground};
  ${theme.borderRadius.modal};
  ${theme.shadow.popover}

  width: 534px;
  @media (max-width: 560px) {
    width: 100%;
  }
`;
