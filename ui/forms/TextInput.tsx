import { ChangeEvent, forwardRef, InputHTMLAttributes, ReactNode, useRef } from "react";
import { AnimatePresence, AnimateSharedLayout, HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import styled from "styled-components";
import { InputError } from "./InputError";
import { baseInputStyles } from "./utils";
import { useBoolean } from "~shared/hooks/useBoolean";
import { combineCallbacks } from "~shared/callbacks/combineCallbacks";
import { useId } from "~shared/id";
import { POP_ANIMATION_CONFIG } from "~ui/animations";
import { useBoundingBox } from "~shared/hooks/useBoundingBox";
import { FieldWithLabel } from "./FieldWithLabel";
import { useSharedRef } from "~shared/hooks/useSharedRef";

export interface TextInputProps extends HTMLMotionProps<"input"> {
  onChangeText?: (text: string) => void;
  errorMessage?: string;
  icon?: ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(props, ref) {
  const inputRef = useSharedRef<HTMLInputElement | null>(null, [ref]);
  const { onChangeText, errorMessage, placeholder, icon, ...regularProps } = props;
  const iconRef = useRef<HTMLDivElement>(null);

  function handleChangeText(event: ChangeEvent<HTMLInputElement>) {
    onChangeText?.(event.target.value);
  }

  const id = useId();

  const [isFocused, { set: setFocused, unset: unsetFocused }] = useBoolean(false);

  const assertedValue = `${props.value ?? ""}`;

  const shouldPushLabel = assertedValue.length > 0;

  console.log({ icon });

  const iconSize = useBoundingBox(iconRef);

  return (
    <FieldWithLabel
      onClick={() => {
        console.log("click", inputRef);
        inputRef.current?.focus();
      }}
      pushLabel={shouldPushLabel}
      icon={icon}
      hasError={!!errorMessage}
      label={placeholder}
    >
      <TextInputElem
        ref={inputRef}
        {...regularProps}
        onChange={combineCallbacks(props.onChange, handleChangeText)}
        onFocus={combineCallbacks(props.onFocus, setFocused)}
        onBlur={combineCallbacks(props.onBlur, unsetFocused)}
      />
    </FieldWithLabel>
  );
});

const TextInputElem = styled(motion.input)`
  padding: 16px 16px 16px 0;
  width: 100%;

  border: none;
  box-sizing: border-box;

  outline: none;
  background: transparent;
`;
