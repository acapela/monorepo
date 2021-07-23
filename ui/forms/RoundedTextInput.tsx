import { ComponentPropsWithoutRef, ReactNode, ChangeEvent, useRef } from "react";
import styled from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import { BASE_GREY_1, BASE_GREY_3, BASE_GREY_5, BASE_GREY_6, PRIMARY_PINK_1, WHITE } from "~ui/colors";
import { hoverTransition } from "~ui/transitions";
import { combineCallbacks } from "~shared/callbacks/combineCallbacks";

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
      {icon && UIIconHolder}
      <UIInput ref={inputRef} {...inputProps} onChange={combineCallbacks(onChange, handleChangeText)} />
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: flex;
  align-items: center;

  color: ${BASE_GREY_1};
  font-size: 0.875rem;
  line-height: 1.5;

  background: ${WHITE};
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${BASE_GREY_5};
  ${borderRadius.circle}

  ${hoverTransition()}
  &:hover {
    background: ${BASE_GREY_6};
  }

  :focus-within {
    background: ${WHITE};
    border-color: ${PRIMARY_PINK_1};
  }
`;

const UIIconHolder = styled.div``;

const UIInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  width: 100%;

  ::placeholder {
    color: ${BASE_GREY_3};
  }
`;
