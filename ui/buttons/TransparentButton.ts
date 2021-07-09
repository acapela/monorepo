import styled from "styled-components";
import { Button } from "./Button";
import { BASE_GREY_2, BASE_GREY_3, BASE_GREY_6 } from "~ui/colors";

export const TransparentButton = styled(Button)`
  color: hsl(214.7, 11.8%, 31.6%);
  box-shadow: none;

  color: ${BASE_GREY_3};
  background: transparent;
  &:hover {
    color: ${BASE_GREY_2};
    background: ${BASE_GREY_6};
  }
  &:active {
    color: ${BASE_GREY_2};
    background: ${BASE_GREY_6};
  }
`;
