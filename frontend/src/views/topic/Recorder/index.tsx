import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { MicOutline, VideoOutline } from "~ui/icons";
import { FullScreenCountdown } from "./FullScreenCountdown";
import { MediaSource } from "./MediaSource";
import { RecordButton } from "./RecordButton";
import { RecorderControls } from "./RecorderControls";
import { TranscodingIndicator } from "./TranscodingIndicator";
import { useReactMediaRecorder } from "./useReactMediaRecorder";
import { VideoSourcePicker } from "./VideoSourcePicker";

interface RecorderProps {
  className?: string;
  onRecordingReady: (files: File) => void;
}

function recordingBlobToFile(blob: Blob): File {
  const [type, extension] = blob.type.split("/");
  const timestamp = new Date().getTime();
  const name = `${type.toLowerCase()}-recording-${timestamp}.${extension}`;
  const file = new File([blob], name, { lastModified: timestamp, type: blob.type });

  return file;
}

async function transcode(file: File): Promise<File> {
  const [fileType] = file.type.split("/");
  const targetFormat = fileType === "audio" ? "mp3" : "mp4";
  const tempFileName = `temp1.${targetFormat}`;

  const ffmpeg = createFFmpeg({ log: false });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", file.name, await fetchFile(file));
  await ffmpeg.run("-i", file.name, tempFileName);
  const data = ffmpeg.FS("readFile", tempFileName);
  const transcodedBlob = new Blob([data.buffer], { type: `${fileType}/${targetFormat}` });

  return recordingBlobToFile(transcodedBlob);
}

const PureRecorder = ({ className, onRecordingReady }: RecorderProps) => {
  const [isTranscoding, { set: showTranscodingIndicator, unset: hideTranscodingIndicator }] = useBoolean(false);
  const [isDismissed, { set: dismissRecording, unset: clearDismissedStatus }] = useBoolean(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [mediaSource, setMediaSource] = useState<MediaSource | null>(null);
  const { status, startRecording, stopRecording, previewStream, getMediaStream } = useReactMediaRecorder({
    video: mediaSource === MediaSource.CAMERA,
    screen: mediaSource === MediaSource.SCREEN,
    audio: !!mediaSource,
    acquireMediaOnDemand: true,
    onStop: (_url: string, blob: Blob) => setBlob(blob),
  });
  const isRecording = !!mediaSource && status === "recording";
  const [popoverHandlerRef, setPopoverHandlerRef] = useState<HTMLElement | null>(null);
  const [isVideoSourcePickerVisible, { toggle: toggleVideoSourcePicker }] = useBoolean(false);
  const [isCountdownActive, { set: startCountdown, unset: dismissCountdown }] = useBoolean(false);

  const doStartRecording = () => {
    dismissCountdown();
    startRecording();
  };

  const doCancelRecording = () => {
    dismissCountdown();
    dismissRecording();
    setMediaSource(null);
  };

  const doStopRecording = () => {
    setMediaSource(null);
  };

  /* Handle Video Source Picker */
  const startVideoRecording = async (source: MediaSource) => {
    toggleVideoSourcePicker();
    setMediaSource(source);
  };

  useEffect(() => {
    if (!mediaSource) {
      return stopRecording();
    }

    clearDismissedStatus();
    setBlob(null);

    getMediaStream().then(() => {
      if (mediaSource === MediaSource.MICROPHONE) {
        doStartRecording();
      } else {
        startCountdown();
      }
    });
  }, [mediaSource]);

  const onVideoButtonClick = (button: HTMLElement) => {
    setPopoverHandlerRef(button);
    toggleVideoSourcePicker();
  };

  const onAudioButtonClick = (button: HTMLElement) => {
    if (isRecording) {
      doCancelRecording();
    } else {
      setPopoverHandlerRef(button);
      setMediaSource(MediaSource.MICROPHONE);
    }
  };

  useEffect(() => {
    if (!isDismissed && blob) {
      onRecorded(blob);

      // In case recording is forcefully stopped
      setMediaSource(null);
    }
  }, [isDismissed, blob]);

  const onRecorded = async (blob: Blob) => {
    let file = recordingBlobToFile(blob);

    showTranscodingIndicator();
    file = await transcode(file);
    hideTranscodingIndicator();

    onRecordingReady(file);
  };

  return (
    <div className={className}>
      <RecordButton onClick={(event) => onVideoButtonClick(event.currentTarget)}>
        <VideoOutline />
      </RecordButton>
      <RecordButton onClick={(event) => onAudioButtonClick(event.currentTarget)}>
        <MicOutline />
      </RecordButton>
      {isVideoSourcePickerVisible && (
        <VideoSourcePicker handlerRef={popoverHandlerRef} onStartRecording={startVideoRecording} />
      )}
      {isCountdownActive && (
        <FullScreenCountdown seconds={3} onFinished={doStartRecording} onCancelled={doCancelRecording} />
      )}
      {isRecording && (
        <RecorderControls
          handlerRef={popoverHandlerRef}
          onStop={doStopRecording}
          onCancel={doCancelRecording}
          previewStream={mediaSource === MediaSource.MICROPHONE ? null : previewStream}
          flipVideoPreview={mediaSource === MediaSource.CAMERA}
          cornered={mediaSource !== MediaSource.MICROPHONE}
        />
      )}
      {isTranscoding && <TranscodingIndicator />}
    </div>
  );
};

export const Recorder = styled(PureRecorder)`
  display: flex;
  flex-direction: row;

  ${RecordButton} {
    margin-right: 1rem;
  }
`;
