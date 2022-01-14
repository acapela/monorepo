import React from "react";
import { ReactNode } from "react";
import styled from "styled-components";

import { useShortcut } from "@aca/ui/keyboard/useShortcut";
import { Modal, ModalAnchor } from "@aca/ui/Modal";
import { theme } from "@aca/ui/theme";

interface Props {
  warning?: string;
  title: string;
  description?: string;
  onCloseRequest: () => void;
  hasCloseButton?: boolean;
  anchor?: ModalAnchor;
  children: ReactNode;
}

export const WarningModal = ({
  warning = "One sec!",
  title,
  description,
  onCloseRequest,
  hasCloseButton = false,
  children,
  anchor,
}: Props) => {
  useShortcut("Escape", onCloseRequest);

  return (
    <Modal anchor={anchor} onCloseRequest={onCloseRequest} hasCloseButton={hasCloseButton}>
      <UIContentWrapper>
        <UIHeader>
          <UITitle>{warning}</UITitle>
          <UISubtitle>{title}</UISubtitle>
        </UIHeader>
        {description && <UIDescription>{description}</UIDescription>}
        {children}
      </UIContentWrapper>
    </Modal>
  );
};

const UIContentWrapper = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;

  max-width: 480px;
`;

const UIHeader = styled.div<{}>`
  padding: 0 48px;
`;

const UITitle = styled.p<{}>`
  ${theme.typo.secondaryTitle};
  color: ${theme.colors.status.warning()};
`;

const UISubtitle = styled.p<{}>`
  ${theme.typo.content.bold};
`;

const UIDescription = styled.p<{}>`
  ${theme.typo.label.secondary};
`;
