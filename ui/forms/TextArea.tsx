import React, { forwardRef, InputHTMLAttributes, useRef, useState, MutableRefObject, useEffect } from "react";
import styled from "styled-components";
import { baseInputStyles } from "./utils";

export interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  onChangeText?: (text: string) => void;
  isResizable?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { onChangeText, isResizable, ...regularProps },
  forwardedRef
) {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaHeight, setTextAreaHeight] = useState<string>("auto");

  useEffect(() => {
    if (isResizable) {
      // Make it run after all DOM painting and updates done
      queueMicrotask(() => setTextAreaHeight(`${internalRef.current?.scrollHeight}px`));
    }
  }, [regularProps.value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    regularProps?.onChange?.(event);
    onChangeText?.(event.target.value);
  };

  return (
    <UITextArea
      ref={(node: HTMLTextAreaElement) => {
        (internalRef as MutableRefObject<HTMLTextAreaElement>).current = node;

        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as MutableRefObject<HTMLTextAreaElement>).current = node;
        }
      }}
      {...regularProps}
      height={textAreaHeight}
      onChange={handleChange}
    />
  );
});

const UITextArea = styled.textarea<{ height: string }>`
  ${baseInputStyles};

  padding-top: 12px;
  padding-bottom: 12px;

  height: ${({ height }) => height};
  resize: none;
  overflow-y: hidden;
  min-height: 2rem;
`;
