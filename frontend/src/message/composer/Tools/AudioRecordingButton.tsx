import { useRef } from "react";

import { useMicrophoneRecording } from "~shared/recording/useMicrophoneRecording";
import { IconButton } from "~ui/buttons/IconButton";
import { IconMic } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";

import { RecordingInProgressManager } from "./RecordingInProgressManager";

interface Props {
  onRecordingReady: (file: File) => void;
}

export function AudioRecordingButton({ onRecordingReady }: Props) {
  const [recording, startRecording] = useMicrophoneRecording();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <IconButton
        ref={buttonRef}
        icon={<IconMic />}
        onClick={() => startRecording()}
        tooltip={recording ? undefined : "Start recording audio"}
      >
        <IconMic />
      </IconButton>
      {recording && (
        <Popover anchorRef={buttonRef}>
          <RecordingInProgressManager
            recording={recording}
            onFinished={(maybeFile) => {
              if (!maybeFile) return; // Recording was cancelled;

              onRecordingReady(maybeFile);
            }}
          />
        </Popover>
      )}
    </>
  );
}
