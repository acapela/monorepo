import { ChangeEvent, forwardRef, InputHTMLAttributes } from "react";
import { AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { InputError } from "./InputError";
import { baseInputStyles } from "./utils";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChangeText?: (text: string) => void;
  errorMessage?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(props, ref) {
  const { onChangeText, errorMessage, ...regularProps } = props;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    regularProps?.onChange?.(event);

    onChangeText?.(event.target.value);
  }

  return (
    <UIHolder>
      <TextInputElem ref={ref} {...regularProps} onChange={handleChange} />
      <AnimatePresence exitBeforeEnter>{errorMessage && <InputError message={errorMessage} />}</AnimatePresence>
    </UIHolder>
  );
});

const UIHolder = styled.div``;

const TextInputElem = styled.input`
  ${baseInputStyles}

  height: 38px;
`;
