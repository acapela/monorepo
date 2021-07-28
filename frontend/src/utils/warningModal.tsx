import React from "react";
import { ReactNode } from "react";
import styled from "styled-components";
import { Modal, ModalAnchor } from "~frontend/ui/Modal";
import { WARNING_COLOR, BASE_GREY_3 } from "~ui/theme/colors/base";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { TextH3, TextBody14 } from "~ui/typo";

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
          <UIWarningHeader medium>{warning}</UIWarningHeader>
          <UIWarningTitle medium>{title}</UIWarningTitle>
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

const UIWarningHeader = styled(TextH3)`
  padding-bottom: 8px;
  color: ${WARNING_COLOR};
`;

const UIWarningTitle = styled(TextH3)``;

const UIForbiddenAccessDescription = styled(TextBody14)`
  color: ${BASE_GREY_3};
`;
