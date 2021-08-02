import { HTMLMotionProps, motion } from "framer-motion";
import { ChangeEvent, ReactNode } from "react";
import styled from "styled-components";
import { combineCallbacks } from "~shared/callbacks/combineCallbacks";
import { useSharedRef } from "~shared/hooks/useSharedRef";
import { namedForwardRef } from "~shared/react/namedForwardRef";
import { FieldWithLabel } from "./FieldWithLabel";

export interface TextInputProps extends HTMLMotionProps<"input"> {
  onChangeText?: (text: string) => void;
  errorMessage?: string;
  icon?: ReactNode;
}

export const TextInput = namedForwardRef<HTMLInputElement, TextInputProps>(function TextInput(props, ref) {
  const inputRef = useSharedRef<HTMLInputElement | null>(null, [ref]);
  const { onChangeText, errorMessage, placeholder, icon, ...regularProps } = props;

  function handleChangeText(event: ChangeEvent<HTMLInputElement>) {
    onChangeText?.(event.target.value);
  }

  const assertedValue = `${props.value ?? ""}`;

  const shouldPushLabel = assertedValue.length > 0;

  return (
    <FieldWithLabel
      onClick={() => {
        inputRef.current?.focus();
      }}
      pushLabel={shouldPushLabel}
      icon={icon}
      hasError={!!errorMessage}
      label={placeholder}
    >
      <TextInputElem ref={inputRef} {...regularProps} onChange={combineCallbacks(props.onChange, handleChangeText)} />
    </FieldWithLabel>
  );
});

const TextInputElem = styled(motion.input)<{}>`
  padding: 16px 16px 16px 0;
  width: 100%;
  border: none;
  box-sizing: border-box;
  outline: none;
  background: transparent;
`;
