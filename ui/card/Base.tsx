import styled from "styled-components";
import { borderRadius, shadow } from "~ui/baseStyles";

export const CardBase = styled.div`
  padding: 24px 20px;
  background: #ffffff;
  border: 1px solid #f8f8f8;
  box-sizing: border-box;
  ${borderRadius.card}
  ${shadow.card}
`;
