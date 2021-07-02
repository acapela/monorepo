import React from "react";
import styled from "styled-components";
import { Button } from "~ui/buttons/Button";
import { createPromiseUI } from "~ui/createPromiseUI";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Modal, ModalAnchor } from "~frontend/ui/Modal";
import { PageTitle } from "~ui/typo";
import { SECONDARY_ORANGE_1 } from "~ui/colors";

type Place = "room" | "space";

interface PromptInput {
  place: Place;
  anchor?: ModalAnchor;
}

type PromptResult = void;

export const openNotFoundModal = createPromiseUI<PromptInput, PromptResult>(({ place, anchor }, resolve) => {
  function handleClose() {
    resolve();
  }

  useShortcut("Escape", handleClose);
  useShortcut("Enter", handleClose);

  return (
    <Modal anchor={anchor} onCloseRequest={handleClose} hasCloseButton={false}>
      <UIContentWrapper>
        <UIHeader>
          <UIWarningHeader>Oops!</UIWarningHeader>
          <UIWarningTitle>The {place} you are looking for was not found</UIWarningTitle>
        </UIHeader>
        <UICloseButton onClick={handleClose}>Go back</UICloseButton>
      </UIContentWrapper>
    </Modal>
  );
});

const UIContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 32px;

  max-width: 480px;
`;

const UIHeader = styled.div`
  padding: 0 24px;
`;

const UIWarningHeader = styled(PageTitle)`
  padding-bottom: 8px;
  color: ${SECONDARY_ORANGE_1};
`;

const UIWarningTitle = styled(PageTitle)``;

const UICloseButton = styled(Button)``;
