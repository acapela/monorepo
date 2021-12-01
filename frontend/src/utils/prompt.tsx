import { useRef, useState } from "react";
import { ReactNode } from "react";
import styled from "styled-components";

import { Modal, ModalAnchor } from "~frontend/ui/Modal";
import { useBoolean } from "~shared/hooks/useBoolean";
import { slugifySync } from "~shared/slugify";
import { InputValidatorFunction } from "~shared/validation/inputValidation";
import { Button } from "~ui/buttons/Button";
import { createPromiseUI } from "~ui/createPromiseUI";
import { TextInput } from "~ui/forms/TextInput";
import { useShortcut } from "~ui/keyboard/useShortcut";

interface PromptInput {
  title: string;
  description?: string;
  placeholder?: string;
  inputIcon?: ReactNode;
  submitLabel?: string;
  initialValue?: string;
  anchor?: ModalAnchor;
  validateInput?: InputValidatorFunction;
}

type PromptResult = string | null;

export const openUIPrompt = createPromiseUI<PromptInput, PromptResult>(
  (
    { title, initialValue = "", submitLabel = "Submit", placeholder, description, anchor, validateInput, inputIcon },
    resolve
  ) => {
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
            data-test-id={`prompt-input-${slugifySync(title, title.toLowerCase())}`}
            ref={inputRef}
            icon={inputIcon}
            onBlur={showValidationErrors}
            autoFocus
            placeholder={placeholder}
            value={value}
            onChangeText={setValue}
            errorMessage={shouldShowValidationError ? validationError : undefined}
          />
          <Button kind="primary" shortcut="Enter" onClick={handleSubmit}>
            {submitLabel}
          </Button>
        </UIContentWrapper>
      </Modal>
    );
  }
);

const UIContentWrapper = styled.div<{}>`
  display: flex;
  flex-direction: column;

  ${Button} {
    margin-top: 1rem;
  }
`;
