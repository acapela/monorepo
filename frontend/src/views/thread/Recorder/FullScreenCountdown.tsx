import React, { useRef, useState } from "react";
import { useInterval, useKey } from "react-use";
import styled from "styled-components";
import { ClientOnlyPortal } from "./ClientOnlyPortal";

interface CountdownParams {
  seconds: number;
  onFinished: () => void;
  onCancelled: () => void;
}

export const FullScreenCountdown = ({ seconds: startFrom, onFinished, onCancelled }: CountdownParams) => {
  const intervalRef = useRef<number | null>(null);
  const [seconds, setSeconds] = useState(startFrom);

  useKey("Escape", () => {
    clearInterval(intervalRef.current as number);
    intervalRef.current = null;
    onCancelled();
  });

  useInterval(() => {
    const newSeconds = seconds - 1;

    if (newSeconds === 0) {
      onFinished();
    } else {
      setSeconds((seconds) => seconds - 1);
    }
  }, 1000);

  return (
    <ClientOnlyPortal selector="#__next > div">
      <UIBackDrop />
      <UIModal>
        <UICounter>{seconds}</UICounter>
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

const UICounter = styled.div`
  font-size: 6rem;
  color: #fff;
`;
