import { RefObject, useState } from "react";
import { useIsomorphicLayoutEffect } from "react-use";
import styled, { css } from "styled-components";
import { IconMonitor, IconUser } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";
import { MediaSource } from "./MediaSource";

interface VideoSourcePickerParams {
  handlerRef: RefObject<HTMLElement>;
  onStartRecording: (source: MediaSource) => void;
  screenCaptureError: string;
  cameraCaptureError: string;
  className?: string;
}

const PureVideoSourcePicker = ({
  handlerRef,
  onStartRecording,
  screenCaptureError,
  cameraCaptureError,
  className,
}: VideoSourcePickerParams) => {
  const [source, setSource] = useState<MediaSource | null>();

  useIsomorphicLayoutEffect(() => {
    setSource((!screenCaptureError && MediaSource.SCREEN) || (!cameraCaptureError && MediaSource.CAMERA) || null);
  }, []);

  return (
    <Popover anchorRef={handlerRef} placement="top">
      <div className={className}>
        <UISourcesWrapper>
          <UISourceButton
            selected={source === MediaSource.SCREEN && !screenCaptureError}
            onClick={() => setSource(MediaSource.SCREEN)}
            disabled={!!screenCaptureError}
            title={screenCaptureError}
          >
            <IconMonitor />
            <UISourceLabel>Screen</UISourceLabel>
          </UISourceButton>
          <UISourceButton
            selected={source === MediaSource.CAMERA && !cameraCaptureError}
            onClick={() => setSource(MediaSource.CAMERA)}
            disabled={!!cameraCaptureError}
            title={cameraCaptureError}
          >
            <IconUser />
            <UISourceLabel>Camera</UISourceLabel>
          </UISourceButton>
        </UISourcesWrapper>
        <UIConfirmButton onClick={() => source && onStartRecording(source)} disabled={!source}>
          Start recording
        </UIConfirmButton>
      </div>
    </Popover>
  );
};

export const VideoSourcePicker = styled(PureVideoSourcePicker)`
  background-color: white;
  padding: 0.5rem;
  border-radius: 0.625rem;
  user-select: none;
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 8%);
`;

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

  :disabled {
    cursor: default;
    svg {
      fill: #a7a3a3;
    }
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

  :disabled {
    background-color: #a5a5a5;
  }
`;
