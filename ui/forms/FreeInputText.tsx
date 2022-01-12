import { HTMLMotionProps, motion } from "framer-motion";
import React, { ChangeEvent, ReactNode } from "react";
import styled from "styled-components";

import { combineCallbacks } from "@aca/shared/callbacks/combineCallbacks";
import { useSharedRef } from "@aca/shared/hooks/useSharedRef";
import { namedForwardRef } from "@aca/shared/react/namedForwardRef";

export interface Props extends HTMLMotionProps<"input"> {
  onChangeText?: (text: string) => void;
  errorMessage?: string;
  icon?: ReactNode;
}

export const FreeTextInput = namedForwardRef<HTMLInputElement, Props>(function TextInput(props, ref) {
  const inputRef = useSharedRef<HTMLInputElement | null>(null, [ref]);
  const { onChangeText, placeholder, ...regularProps } = props;

  function handleChangeText(event: ChangeEvent<HTMLInputElement>) {
    onChangeText?.(event.target.value);
  }

  return (
    <TextInputElem
      placeholder={placeholder}
      ref={inputRef}
      {...regularProps}
      onChange={combineCallbacks(props.onChange, handleChangeText)}
    />
  );
});

const TextInputElem = styled(motion.input)<{}>`
  padding: 16px 16px 16px 0;
  width: 100%;
  border: none;
  box-sizing: border-box;
  outline: none;
  background: transparent;

  ::placeholder {
    color: rgba(0, 0, 0, 0.2);
  }
`;
