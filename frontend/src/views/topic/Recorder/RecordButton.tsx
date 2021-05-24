import styled from "styled-components";

export const RecordButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.5rem;
  background: #f8f8f8;
  color: #707f8c;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;

  :disabled {
    cursor: default;

    svg {
      fill: #a7a3a3;
    }
  }
`;
