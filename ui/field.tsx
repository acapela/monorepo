import { useCallback, useState, ChangeEventHandler, InputHTMLAttributes, useRef, RefObject } from "react";
import styled from "styled-components";
import { borderRadius } from "./baseStyles";

export const Field = styled.input`
  font: inherit;
  width: 100%;
  font-weight: 500;
  padding: 0.75rem 1rem;
  background-color: #fbfbfb;
  border-radius: ${borderRadius.medium};
  outline: none;
`;

function appendAtSelection(text: string, textToAppend: string, selectionStart: number) {
  const textBeforeCursorPosition = text.substring(0, selectionStart);
  const textAfterCursorPosition = text.substring(selectionStart, text.length);
  return textBeforeCursorPosition + textToAppend + textAfterCursorPosition;
}

export function useFieldValue(initial = "", ref?: RefObject<HTMLInputElement>) {
  const [value, setValue] = useState(initial);

  const selectionStartRef = useRef(0);

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setValue(event.target.value);
    },
    [setValue]
  );

  const reset = useCallback(() => {
    setValue("");
  }, []);

  const bindProps: Partial<InputHTMLAttributes<HTMLInputElement>> = {
    value,
    onChange: onChangeHandler,
    onSelect: (event) => {
      selectionStartRef.current = event.currentTarget.selectionStart ?? 0;
    },
  };

  function appendAtCursor(textToAppend: string, focus = true) {
    setValue((oldValue) => {
      return appendAtSelection(oldValue, textToAppend, selectionStartRef.current);
    });

    if (!focus || !ref?.current) return;

    const input = ref.current;

    const cursorPosition = selectionStartRef.current;

    setTimeout(() => {
      input.focus();
      input.selectionStart = input.selectionEnd = cursorPosition + 1;
    }, 1);
  }

  return { value, onChangeHandler, setValue, reset, bindProps, appendAtCursor };
}
