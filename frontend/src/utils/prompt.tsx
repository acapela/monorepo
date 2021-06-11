import { useRef, useState } from "react";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Button } from "~ui/buttons/Button";
import { TextInput } from "~ui/forms/TextInput";
import { Modal, ModalAnchor } from "~frontend/ui/Modal";
import { createPromiseUI } from "~ui/createPromiseUI";
import styled from "styled-components";
import { useBoolean } from "~shared/hooks/useBoolean";
import { InputValidatorFunction } from "~shared/validation/inputValidation";

interface PromptInput {
  title: string;
  description?: string;
  placeholder?: string;
  submitLabel?: string;
  initialValue?: string;
  anchor?: ModalAnchor;
  validateInput?: InputValidatorFunction;
}

type PromptResult = string | null;

export const openUIPrompt = createPromiseUI<PromptInput, PromptResult>(
  ({ title, initialValue = "", submitLabel = "Submit", placeholder, description, anchor, validateInput }, resolve) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState(initialValue);
    const [shouldShowValidationError, { set: showValidationErrors }] = useBoolean(false);

    function handleClose() {
      resolve(null);
    }

    function handleSubmit() {
      showValidationErrors();
      if (validationError) {
        inputRef.current?.focus();
        return;
      }

      resolve(value);
    }

    useShortcut("Escape", handleClose);
    useShortcut("Enter", handleSubmit);

    function getValidationError() {
      if (!validateInput) return;

      const validationResult = validateInput(value);

      if (validationResult === true) {
        return;
      }

      return validationResult;
    }

    const validationError = getValidationError();

    return (
      <Modal
        anchor={anchor}
        head={{
          title,
          description,
        }}
        onCloseRequest={handleClose}
      >
        <UIContentWrapper>
          <TextInput
            ref={inputRef}
            onBlur={showValidationErrors}
            autoFocus
            placeholder={placeholder}
            value={value}
            onChangeText={setValue}
            errorMessage={shouldShowValidationError ? validationError : undefined}
          />
          <Button onClick={handleSubmit}>{submitLabel}</Button>
        </UIContentWrapper>
      </Modal>
    );
  }
);

const UIContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${Button} {
    margin-top: 1rem;
  }
`;
