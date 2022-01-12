import { useEffect, useRef } from "react";
import styled, { css } from "styled-components";

import { theme } from "@aca/ui/theme";

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

export const VideoPreview = styled(PureVideoPreview)<{}>`
  width: 180px;
  height: 180px;

  object-fit: cover;

  border: 1px solid ${theme.colors.layout.background.border};
  ${theme.radius.circle}

  ${({ flip }) =>
    flip &&
    css`
      transform: rotateY(180deg);
    `}
`;
