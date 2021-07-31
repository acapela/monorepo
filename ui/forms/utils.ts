import { css } from "styled-components";
import { borderRadius } from "~ui/baseStyles";

export const baseInputStyles = css`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 16px;
  width: 100%;

  border: 1px solid hsla(0, 0%, 75%, 0.25);
  box-sizing: border-box;
  ${borderRadius.input}

  outline: none;
`;
