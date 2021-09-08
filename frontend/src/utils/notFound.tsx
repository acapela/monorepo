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

export const openNotFoundModal = createPromiseUI<PromptInput, PromptResult>(({ place, anchor }, resolve) => {
  function handleClose() {
    resolve();
  }

  return (
    <WarningModal
      warning={"Oops!"}
      title={`The ${place} you're looking for was not found`}
      anchor={anchor}
      onCloseRequest={handleClose}
    >
      <UICloseButton onClick={handleClose}>Get back</UICloseButton>
    </WarningModal>
  );
});

const UICloseButton = styled(Button)<{}>``;
