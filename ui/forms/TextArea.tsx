import { ChangeEvent, forwardRef, InputHTMLAttributes } from "react";
import styled from "styled-components";

export interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  onChangeText?: (text: string) => void;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(props, ref) {
  const { onChangeText, ...regularProps } = props;

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    regularProps?.onChange?.(event);

    onChangeText?.(event.target.value);
  }

  return <UITextArea ref={ref} {...regularProps} onChange={handleChange} />;
});

const UITextArea = styled.textarea`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 8px 16px;
  height: 72px;
  width: 100%;

  border: 1px solid hsla(0, 0%, 75%, 0.25);
  box-sizing: border-box;
  border-radius: 0.5rem;

  resize: none;
`;
