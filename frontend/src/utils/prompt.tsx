import { useState } from "react";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Button } from "~ui/buttons/Button";
import { TextInput } from "~ui/forms/TextInput";
import { Modal, ModalAnchor } from "~frontend/ui/Modal";
import { createPromiseUI } from "~ui/createPromiseUI";
import styled from "styled-components";

interface PromptInput {
  title: string;
  description?: string;
  placeholder?: string;
  submitLabel?: string;
  initialValue?: string;
  anchor?: ModalAnchor;
}

type PromptResult = string | null;

export const openUIPrompt = createPromiseUI<PromptInput, PromptResult>(
  ({ title, initialValue = "", submitLabel = "Submit", placeholder, description, anchor }, resolve) => {
    const [value, setValue] = useState(initialValue);

    useShortcut("Escape", () => resolve(null));
    useShortcut("Enter", () => resolve(value));

    return (
      <Modal
        anchor={anchor}
        head={{
          title,
          description,
        }}
        onCloseRequest={() => resolve(null)}
      >
        <UIContentWrapper>
          <TextInput autoFocus placeholder={placeholder} value={value} onChangeText={setValue} />
          <Button onClick={() => resolve(value)}>{submitLabel}</Button>
        </UIContentWrapper>
      </Modal>
    );
  }
);

const UIContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  ${Button} {
    margin-top: 1rem;
  }
`;
