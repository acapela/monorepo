/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import styled, { keyframes } from "styled-components";

// @ts-ignore
import logoBg from "./logo-bg.svg";
// @ts-ignore
import logoWave from "./logo-wave.svg";

export default function AssetsRecorder() {
  return (
    <UIHolder>
      <UICropper>
        <UILogoBg>
          <UIAnimatedWave />
        </UILogoBg>
      </UICropper>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  position: fixed;
  inset: 0;
  align-items: center;
  justify-content: center;
`;

const LOGO_SIZE = 160;
const WAVE_HEIGHT_RATIO = 142 / 256; // Taken from figma
const WAVE_CYCLE_WIDTH_RATIO = 303 / 256; // Taken from figma

const UICropper = styled.div`
  display: flex;
  border: 1px solid #000;
  padding: 2px;
`;

const WAVE_HEIGHT = LOGO_SIZE * WAVE_HEIGHT_RATIO;
const WAVE_CYCLE_WIDTH = LOGO_SIZE * WAVE_CYCLE_WIDTH_RATIO;

const WAVE_LOGO_OFFSET = (WAVE_CYCLE_WIDTH - LOGO_SIZE) / 2;

const UILogoBg = styled.div`
  background-image: url(${logoBg});
  background-size: cover;
  width: ${LOGO_SIZE}px;
  height: ${LOGO_SIZE}px;
  overflow: hidden;
  position: relative;
`;

const ANIMATION_WAVE_CYCLES = 2;
const ANIMATION_DURATION_S = 4;

const waveAnimation = keyframes`
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-${WAVE_CYCLE_WIDTH * ANIMATION_WAVE_CYCLES}px);
  }
`;

const UIAnimatedWave = styled.div`
  background-image: url(${logoWave});
  background-size: contain;
  background-repeat: repeat-x;
  width: ${WAVE_CYCLE_WIDTH * (ANIMATION_WAVE_CYCLES + 1)}px;
  /* width: ${WAVE_CYCLE_WIDTH}px; */
  height: ${WAVE_HEIGHT}px;
  overflow: hidden;
  position: absolute;
  top: ${(LOGO_SIZE - WAVE_HEIGHT) / 2}px;
  left: -${WAVE_LOGO_OFFSET}px;
  will-change: transform;

  animation: ${waveAnimation} ${ANIMATION_DURATION_S}s ease-in-out both;
`;
