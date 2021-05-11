import { useState } from "react";
import styled, { css } from "styled-components";
import { MonitorOutline, PersonOutline } from "~ui/icons";
import { Popover } from "~ui/Popover";

export enum VideoSource {
  SCREEN = "screen",
  CAMERA = "camera",
}

interface VideoSourcePickerParams {
  handlerRef: HTMLElement | null;
  onStartRecording: (source: VideoSource) => void;
  activeSource?: VideoSource;
  className?: string;
}

export const VideoSourcePicker = ({
  handlerRef,
  onStartRecording,
  activeSource = VideoSource.SCREEN,
}: VideoSourcePickerParams) => {
  const [source, setSource] = useState<VideoSource>(activeSource);

  return (
    <Popover handlerRef={handlerRef}>
      <UISourcesWrapper>
        <UISourceButton selected={source === VideoSource.SCREEN} onClick={() => setSource(VideoSource.SCREEN)}>
          <MonitorOutline />
          <UISourceLabel>Screen</UISourceLabel>
        </UISourceButton>
        <UISourceButton selected={source === VideoSource.CAMERA} onClick={() => setSource(VideoSource.CAMERA)}>
          <PersonOutline />
          <UISourceLabel>Camera</UISourceLabel>
        </UISourceButton>
      </UISourcesWrapper>
      <UIConfirmButton onClick={() => onStartRecording(source)}>Start recording</UIConfirmButton>
    </Popover>
  );
};

const UISourcesWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-display: row;
  justify-content: space-between;
`;

const UISourceButton = styled.button<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid transparent;
  height: 3.1rem;
  padding: 0.5rem;
  background-color: #f8f8f8;
  border-radius: 0.75rem;

  ${({ selected }) =>
    selected &&
    css`
      border-color: #828282;
    `}

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

const UISourceLabel = styled.span`
  font-size: 0.85rem;
`;

const UIConfirmButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 0.5rem 1.125rem;
  background-color: #292829;
  color: #fff;
  font-weight: 400;
  border-radius: 0.75rem;
`;
