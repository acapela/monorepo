import { useEffect, useRef } from "react";
import styled, { css } from "styled-components";

interface VideoPreviewParams {
  stream?: MediaStream | null;
  flip?: boolean;
  className?: string;
}

const PureVideoPreview = ({ stream, className }: VideoPreviewParams) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return null;
  }

  return <video className={className} ref={videoRef} autoPlay preload="true" />;
};

export const VideoPreview = styled(PureVideoPreview)`
  width: 11.25rem;
  height: 11.25rem;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #969696;

  ${({ flip }) =>
    flip &&
    css`
      transform: rotateY(180deg);
    `}
`;
