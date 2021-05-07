import { useState } from "react";
import { usePopper } from "react-popper";
import styled, { css } from "styled-components";
import { MonitorOutline, PersonOutline } from "~ui/icons";

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

const PureVideoSourcePicker = ({
  className,
  handlerRef,
  onStartRecording,
  activeSource = VideoSource.SCREEN,
}: VideoSourcePickerParams) => {
  const [popperElement, setPopperElement] = useState<HTMLElement | null>();
  const [source, setSource] = useState<VideoSource>(activeSource);
  const { styles, attributes } = usePopper(handlerRef, popperElement, {
    placement: "top",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 5],
        },
      },
    ],
  });

  return (
    <div className={className} ref={setPopperElement} style={styles.popper} {...attributes.popper}>
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
    </div>
  );
};

export const VideoSourcePicker = styled(PureVideoSourcePicker)`
  min-width: 175px;
  background-color: white;
  padding: 1rem;
  border-radius: 0.625rem;
  user-select: none;
  box-shadow: 0px 0.5rem 1rem rgb(0 0 0 / 8%);
`;

const UISourcesWrapper = styled.div`
  display: flex;
  flex-display: row;
  justify-content: space-between;
`;

const UISourceButton = styled.button<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid transparent;
  height: 50px;
  padding: 0.5rem;
  background-color: #f8f8f8;
  border-radius: 0.75rem;

  ${({ selected }) =>
    selected &&
    css`
      border-color: #828282;
    `}

  svg {
    width: 20px;
    height: 20px;
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
