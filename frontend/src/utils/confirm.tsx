import { ReactNode } from "react";
import styled from "styled-components";

import { Modal } from "~frontend/ui/Modal";
import { Button } from "~ui/buttons/Button";
import { createPromiseUI } from "~ui/createPromiseUI";
import { useShortcut } from "~ui/keyboard/useShortcut";

interface PromptInput {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}

type PromptResult = boolean;

export const openConfirmPrompt = createPromiseUI<PromptInput, PromptResult>(
  ({ title, confirmLabel = "Confirm", cancelLabel = "Cancel", description }, resolve) => {
    useShortcut("Escape", () => resolve(false));
    useShortcut("Enter", () => resolve(true));

    return (
      <Modal
        head={{
          title,
          description,
        }}
        onCloseRequest={() => resolve(false)}
      >
        <UIContentWrapper>
          <Button onClick={() => resolve(false)}>{cancelLabel}</Button>
          <Button onClick={() => resolve(true)}>{confirmLabel}</Button>
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
