import styled from "styled-components";

export const MASTER_WIDTH = 1240;

export const GUTTER_WIDTH_REM = 1;

export const Container = styled.div`
  max-width: ${MASTER_WIDTH}px;
  margin: auto;
  padding-left: ${GUTTER_WIDTH_REM}rem;
  padding-right: ${GUTTER_WIDTH_REM}rem;
  flex: 1;
  align-self: flex-start;
  width: 100%;

  & & {
    padding-left: 0;
    padding-right: 0;
  }
`;
