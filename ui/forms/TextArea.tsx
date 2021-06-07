import { ChangeEvent, forwardRef, InputHTMLAttributes } from "react";
import styled from "styled-components";
import { baseInputStyles } from "./utils";

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
  ${baseInputStyles};

  padding-top: 12px;
  padding-bottom: 12px;

  height: 72px;
  resize: none;
`;
