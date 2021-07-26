import styled from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import { BASE_GREY_1, BASE_GREY_3, BASE_GREY_5, BASE_GREY_6, PRIMARY_PINK_1, WHITE } from "~ui/colors";
import { hoverTransition } from "~ui/transitions";

export const RoundedInput = styled.input`
  display: flex;
  align-items: center;

  color: ${BASE_GREY_1};
  font-size: 0.875rem;
  line-height: 1.5;

  outline: none;
  background: ${WHITE};
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${BASE_GREY_5};
  ${borderRadius.circle}

  ${hoverTransition()}
  &:hover {
    background: ${BASE_GREY_6};
  }
  &:focus {
    background: ${WHITE};
    border-color: ${PRIMARY_PINK_1};
  }
  &:active {
    background: ${WHITE};
    border-color: ${PRIMARY_PINK_1};
  }

  ::placeholder {
    color: ${BASE_GREY_3};
  }
`;
