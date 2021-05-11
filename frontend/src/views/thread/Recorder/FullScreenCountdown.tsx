import React, { useState } from "react";
import { useInterval, useKey } from "react-use";
import styled from "styled-components";
import { BodyPortal } from "~ui/BodyPortal";

interface CountdownParams {
  seconds: number;
  onFinished: () => void;
  onCancelled: () => void;
}

export const FullScreenCountdown = ({ seconds: startFrom, onFinished, onCancelled }: CountdownParams) => {
  const [seconds, setSeconds] = useState(startFrom);

  useKey("Escape", () => {
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
    <BodyPortal>
      <UIBackDrop />
      <UIModal>
        <UICounter>{seconds}</UICounter>
      </UIModal>
    </BodyPortal>
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
  top: 0;
  left: 0;
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
