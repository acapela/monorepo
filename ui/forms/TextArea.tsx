import React, { forwardRef, InputHTMLAttributes, useRef, useState, MutableRefObject } from "react";
import styled from "styled-components";
import { baseInputStyles } from "./utils";

export interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  onChangeText?: (text: string) => void;
  isResizable?: boolean;
}

const MINIMUM_HEIGHT_PX = 48;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(props, forwardedRef) {
  const { onChangeText, isResizable, ...regularProps } = props;

  const internalRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaHeight, setTextAreaHeight] = useState<number>(MINIMUM_HEIGHT_PX);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isResizable) {
      const size = Math.max(MINIMUM_HEIGHT_PX, internalRef.current?.scrollHeight ?? 0);
      setTextAreaHeight(size);
    }

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

const UITextArea = styled.textarea<{ height: number }>`
  ${baseInputStyles};

  padding-top: 12px;
  padding-bottom: 12px;

  height: ${({ height }) => `${height}px`};
  resize: none;
  overflow: hidden;
  min-height: ${MINIMUM_HEIGHT_PX}px;
`;
