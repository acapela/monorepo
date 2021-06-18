import styled from "styled-components";
import { borderRadius } from "./baseStyles";

export const Badge = styled.div`
  font-weight: bold;
  font-size: 0.875rem;
  background-color: rgb(136 136 136 / 10%);
  padding: 0.5em 0.75em;
  ${borderRadius.label}
`;
