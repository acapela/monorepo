import { ChangeEvent, ComponentPropsWithoutRef, ReactNode, useRef } from "react";
import styled from "styled-components";

import { combineCallbacks } from "~shared/callbacks/combineCallbacks";
import { theme } from "~ui/theme";

interface Props extends ComponentPropsWithoutRef<"input"> {
  onChangeText?: (text: string) => void;
  icon?: ReactNode;
}

export const RoundedTextInput = ({ icon, onChangeText, onChange, ...inputProps }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChangeText(event: ChangeEvent<HTMLInputElement>) {
    onChangeText?.(event.target.value);
  }

  return (
    <UIHolder
      onClick={() => {
        inputRef.current?.focus();
      }}
    >
      {icon && <UIIconHolder>{icon}</UIIconHolder>}
      <UIInput ref={inputRef} {...inputProps} onChange={combineCallbacks(onChange, handleChangeText)} />
    </UIHolder>
  );
};

const background = theme.colors.layout.background;

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 8px;

  ${background.asBgWithReadableText};
  font-size: 0.875rem;
  line-height: 1.5;

  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${background.border};
  ${theme.radius.circle}

  ${theme.transitions.hover()}

  &:hover {
    ${background.hover.asBg}
  }

  :focus-within {
    border-color: ${theme.colors.primary};
  }
`;

const UIIconHolder = styled.div<{}>`
  font-size: 1.5rem;
  ${theme.colors.text.secondary.asColor};
`;

const UIInput = styled.input<{}>`
  border: none;
  outline: none;
  background: transparent;
  width: 100%;

  ::placeholder {
    ${theme.colors.text.secondary.asColor};
  }
`;
