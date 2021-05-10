import styled from "styled-components";
import { ClientOnlyPortal } from "./ClientOnlyPortal";

export const TranscodingIndicator = () => {
  return (
    <ClientOnlyPortal selector="#__next > div">
      <UIBackDrop />
      <UIModal>
        <UIMessage>
          Please wait while we convert your recording
          <br />
          Do not close this tab
        </UIMessage>
      </UIModal>
    </ClientOnlyPortal>
  );
};

const UIBackDrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000;
  width: 100vw;
  height: 100vh;
  opacity: 0.6;
`;

const UIModal = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const UIMessage = styled.span`
  font-size: 3rem;
  color: #fff;
  text-align: center;
`;
