import { ReactNode } from "react";
import styled from "styled-components";

import { Modal } from "@aca/frontend/ui/Modal";
import { Button } from "@aca/ui/buttons/Button";
import { createPromiseUI } from "@aca/ui/createPromiseUI";

interface PromptInput {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}

type PromptResult = boolean;

export const openConfirmPrompt = createPromiseUI<PromptInput, PromptResult>(
  ({ title, confirmLabel = "Confirm", cancelLabel = "Cancel", description }, resolve) => {
    return (
      <Modal
        head={{
          title,
          description,
        }}
        onCloseRequest={() => resolve(false)}
      >
        <UIContentWrapper>
          <Button shortcut="Esc" onClick={() => resolve(false)}>
            {cancelLabel}
          </Button>
          <Button shortcut="Enter" kind="primary" onClick={() => resolve(true)}>
            {confirmLabel}
          </Button>
        </UIContentWrapper>
      </Modal>
    );
  }
);

const UIContentWrapper = styled.div<{}>`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;
