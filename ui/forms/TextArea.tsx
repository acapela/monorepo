import React, { InputHTMLAttributes, useEffect, useState } from "react";
import styled from "styled-components";

import { useSharedRef } from "~shared/hooks/useSharedRef";
import { namedForwardRef } from "~shared/react/namedForwardRef";

import { baseInputStyles } from "./utils";

export interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  onChangeText?: (text: string) => void;
  isResizable?: boolean;
}

export const TextArea = namedForwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { onChangeText, isResizable, ...regularProps },
  forwardedRef
) {
  const ref = useSharedRef<HTMLTextAreaElement | null>(null, [forwardedRef]);
  const [textAreaHeight, setTextAreaHeight] = useState<string>("auto");

  useEffect(() => {
    if (isResizable) {
      // Make it run after all DOM painting and updates done
      queueMicrotask(() => setTextAreaHeight(`${ref.current?.scrollHeight}px`));
    }
  }, [regularProps.value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    regularProps?.onChange?.(event);
    onChangeText?.(event.target.value);
  };

  return <UITextArea ref={ref} {...regularProps} height={textAreaHeight} onChange={handleChange} />;
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
