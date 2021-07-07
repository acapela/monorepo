import React from "react";
import { ReactNode } from "react";
import styled from "styled-components";
import { Modal, ModalAnchor } from "~frontend/ui/Modal";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { PageTitle } from "~ui/typo";

import { warningColor } from "~ui/themes/utils";

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
          <UIWarningHeader>{warning}</UIWarningHeader>
          <UIWarningTitle>{title}</UIWarningTitle>
        </UIHeader>
        {description && <UIForbiddenAccessDescription>{description}</UIForbiddenAccessDescription>}
        {children}
      </UIContentWrapper>
    </Modal>
  );
};

const UIContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;

  max-width: 480px;
`;

const UIHeader = styled.div`
  padding: 0 48px;
`;

const UIWarningHeader = styled(PageTitle)`
  padding-bottom: 8px;
  color: ${warningColor};
`;

const UIWarningTitle = styled(PageTitle)``;

const UIForbiddenAccessDescription = styled.p`
  line-height: 1.5;
`;
