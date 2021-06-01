import { useState } from "react";
import { useKey } from "react-use";
import { Button } from "~ui/button";
import { TextInput } from "~ui/forms/TextInput";
import { Modal } from "~frontend/ui/Modal";
import { createPromiseUI } from "~ui/createPromiseUI";
import styled from "styled-components";

interface PromptInput {
  title: string;
  description?: string;
  placeholder?: string;
  submitLabel?: string;
  initialValue?: string;
}

type PromptResult = string | null;

export const openUIPrompt = createPromiseUI<PromptInput, PromptResult>(
  ({ title, initialValue = "", submitLabel = "Submit", placeholder, description }, resolve) => {
    const [value, setValue] = useState(initialValue);

    useKey("Escape", () => resolve(null));
    useKey("Enter", () => resolve(value));

    return (
      <Modal
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
