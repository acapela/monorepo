import styled, { css } from "styled-components";
import { fontSize } from "./baseStyles";

interface Props {
  isLoading?: boolean;
  wide?: boolean;
}

export const Button = styled.button<Props>`
  padding: 0.5em 0.75em;
  font-size: ${fontSize.copy};
  font-weight: 600;
  color: #fff;
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};
  cursor: ${(props) => (props.isLoading ? "wait" : "pointer")};
  background: #474f5a;
  border-radius: 10000px;

  ${(props) =>
    props.wide &&
    css`
      display: block;
      width: 100%;
    `}
`;
