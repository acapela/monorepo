import { ChangeEvent, forwardRef, InputHTMLAttributes } from "react";
import styled from "styled-components";
import { baseInputStyles } from "./utils";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChangeText?: (text: string) => void;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(props, ref) {
  const { onChangeText, ...regularProps } = props;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    regularProps?.onChange?.(event);

    onChangeText?.(event.target.value);
  }

  return <TextInputElem ref={ref} {...regularProps} onChange={handleChange} />;
});

const TextInputElem = styled.input`
  ${baseInputStyles}

  height: 38px;
`;
