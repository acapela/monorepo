import styled from "styled-components";
import { borderRadius, shadow } from "./baseStyles";

interface Props {
  isLoading?: boolean;
}

export const Button = styled.button<Props>`
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};
  padding: 0.5em 1.5em;
  font-size: 1rem;
  border: 1px solid;
  font-weight: 600;

  ${shadow.medium};
  ${borderRadius.medium};
`;
