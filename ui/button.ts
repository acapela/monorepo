import styled, { css } from "styled-components";
import { borderRadius, shadow } from "./baseStyles";
import { boolPropStyles } from "./styleHelpers";

interface Props {
  isLoading?: boolean;
  wide?: boolean;
}

export const Button = styled.button<Props>`
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};
  padding: 0.5em 1.5em;
  font-size: 1rem;
  font-weight: 600;
  background-color: #559bf9;
  color: #fff;

  ${borderRadius.medium};
  ${boolPropStyles(
    "wide",
    css`
      display: block;
      width: 100%;
    `
  )}
`;
