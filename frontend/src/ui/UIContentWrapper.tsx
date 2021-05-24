import styled from "styled-components";

export const UIContentWrapper = styled.div<{ marginTop?: boolean }>`
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;

  ${(props) => props.marginTop && "margin-top: 16rem;"}
`;
