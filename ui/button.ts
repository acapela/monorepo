import styled, { css } from "styled-components";
import { fontSize } from "./baseStyles";
import { hoverActionCss, hoverActionCssWithCustomColor } from "./transitions";

interface Props {
  isLoading?: boolean;
  wide?: boolean;
}

export const Button = styled.button<Props>`
  padding: 0.75em 1em;
  font: inherit;
  font-size: ${fontSize.copy};
  font-weight: 600;
  color: #fff;
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};
  cursor: ${(props) => (props.isLoading ? "wait" : "pointer")};
  background: #474f5a;
  border-radius: 0.5rem;

  ${hoverActionCssWithCustomColor("#26313E")}

  ${(props) =>
    props.wide &&
    css`
      display: block;
      width: 100%;
    `}
`;

export const TransparentButton = styled(Button)`
  ${hoverActionCss}

  background-color: transparent;
  color: #474f5a;
`;
