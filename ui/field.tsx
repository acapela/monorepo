import { useCallback, useState, ChangeEventHandler } from "react";
import styled from "styled-components";
import { borderRadius } from "./baseStyles";

export const Field = styled.input`
  font: inherit;
  width: 100%;
  font-weight: 500;
  padding: 0.75rem 1rem;
  background-color: #fbfbfb;
  ${borderRadius.medium}

  outline: none;
`;

export function useFieldValue(initial: string) {
  const [value, setValue] = useState(initial);

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setValue(event.target.value);
    },
    [setValue]
  );

  const reset = useCallback(() => {
    setValue("");
  }, []);

  const bindProps = {
    value,
    onChange: onChangeHandler,
  };

  return { value, onChangeHandler, setValue, reset, bindProps };
}
