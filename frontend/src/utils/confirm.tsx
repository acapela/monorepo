import { useKey } from "react-use";
import styled from "styled-components";
import { Modal } from "~frontend/ui/Modal";
import { Button } from "~ui/buttons/Button";
import { createPromiseUI } from "~ui/createPromiseUI";

interface PromptInput {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

type PromptResult = boolean;

export const openConfirmPrompt = createPromiseUI<PromptInput, PromptResult>(
  ({ title, confirmLabel = "Confirm", cancelLabel = "Cancel", description }, resolve) => {
    useKey("Escape", () => resolve(false));
    useKey("Enter", () => resolve(true));

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

const UIContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;
