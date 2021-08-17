import React from "react";
import styled from "styled-components";

import { ModalAnchor } from "~frontend/ui/Modal";
import { Button } from "~ui/buttons/Button";
import { createPromiseUI } from "~ui/createPromiseUI";

import { WarningModal } from "./warningModal";

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

  return (
    <WarningModal
      title={`The ${place} you are trying to open is private`}
      anchor={anchor}
      description={`In order to access the ${place}, you have to be invited as a member to that ${place}. Please reach out to one of
        the members of the ${place} and ask to be invited in.`}
      onCloseRequest={handleClose}
    >
      <UICloseButton onClick={handleClose}>Got it!</UICloseButton>
    </WarningModal>
  );
});

const UICloseButton = styled(Button)<{}>`
  padding-top: 8px;
`;
