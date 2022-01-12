import { useRef } from "react";

import { useMicrophoneRecording } from "@aca/shared/recording/useMicrophoneRecording";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconMic } from "@aca/ui/icons";
import { Popover } from "@aca/ui/popovers/Popover";

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
