import { ChangeEvent, forwardRef, InputHTMLAttributes } from "react";
import styled from "styled-components";

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
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 1rem;
  height: 2.375rem;
  width: 100%;

  border: 1px solid rgba(190, 190, 190, 0.25);
  box-sizing: border-box;
  border-radius: 0.5rem;
`;
