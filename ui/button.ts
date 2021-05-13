import styled, { css } from "styled-components";
import { borderRadius, fontSize } from "./baseStyles";

interface Props {
  isLoading?: boolean;
  wide?: boolean;
}

export const Button = styled.button<Props>`
  padding: 0.5em 1.5em;
  font-size: ${fontSize.copy};
  font-weight: 600;
  background-color: #559bf9;
  color: #fff;
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};
  cursor: ${(props) => (props.isLoading ? "wait" : "pointer")};

  border-radius: ${borderRadius.medium};

  ${(props) =>
    props.wide &&
    css`
      display: block;
      width: 100%;
    `}
`;
