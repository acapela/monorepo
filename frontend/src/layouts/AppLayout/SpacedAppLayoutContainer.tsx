import styled from "styled-components";

import { Container } from "~ui/layout/Container";

type TopSpazeSize = "medium" | "large";

interface Props {
  topSpaceSize?: TopSpazeSize;
}

export const SpacedAppLayoutContainer = styled(Container)<Props>`
  padding-top: ${({ topSpaceSize = "medium" }) =>
    ({
      medium: "32px",
      large: "80px",
    }[topSpaceSize])};
  padding-bottom: 32px;
`;
