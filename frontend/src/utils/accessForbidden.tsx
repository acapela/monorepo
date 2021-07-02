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

export const openForbiddenAccessModal = createPromiseUI<PromptInput, PromptResult>(({ place, anchor }, resolve) => {
  function handleClose() {
    resolve();
  }

  useShortcut("Escape", handleClose);
  useShortcut("Enter", handleClose);

  return (
    <Modal anchor={anchor} onCloseRequest={handleClose} hasCloseButton={false}>
      <UIContentWrapper>
        <UIHeader>
          <UIWarningHeader>One Sec!</UIWarningHeader>
          <UIWarningTitle>The {place} you are trying to open is private. </UIWarningTitle>
        </UIHeader>
        <UIForbiddenAccessDescription>
          In order to access the {place}, you have to be invited as a member to that {place}. Please reach out to one of
          the members of the {place} and ask to be invited in.
        </UIForbiddenAccessDescription>
        <UICloseButton onClick={handleClose}>Got it!</UICloseButton>
      </UIContentWrapper>
    </Modal>
  );
});

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
  color: ${SECONDARY_ORANGE_1};
`;

const UIWarningTitle = styled(PageTitle)``;

const UIForbiddenAccessDescription = styled.p`
  line-height: 1.5;
  padding-bottom: 8px;
`;

const UICloseButton = styled(Button)``;
