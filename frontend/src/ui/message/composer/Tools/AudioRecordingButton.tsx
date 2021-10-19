import { useRef } from "react";

import { IconButton } from "~frontend/../../ui/buttons/IconButton";
import { IconMic } from "~frontend/../../ui/icons";
import { Popover } from "~frontend/../../ui/popovers/Popover";

import { useMicrophoneRecording } from "./recording/useMicrophoneRecording";
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
