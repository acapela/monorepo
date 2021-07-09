import styled from "styled-components";
import { Button } from "./Button";
import { WHITE, BASE_GREY_1, BASE_GREY_4, BASE_GREY_6 } from "~ui/colors";

export const OutlinedButton = styled(Button)`
  color: ${BASE_GREY_1};
  border: 1px solid ${BASE_GREY_4};

  background: ${WHITE};
  &:active {
    background: ${BASE_GREY_6};
  }
  &:hover {
    background: ${BASE_GREY_6};
  }
`;
