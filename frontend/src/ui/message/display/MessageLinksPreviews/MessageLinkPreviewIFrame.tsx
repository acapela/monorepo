import React from "react";
import styled, { css } from "styled-components";

interface Props {
  url: string;
  ratio: number;
}

export const MessageLinkPreviewIFrame = ({ url, ratio }: Props) => {
  return <UIPreview ratio={ratio} src={url} allow="fullscreen" />;
};

const getPreviewDimensions = (width: number, ratio: number) => css`
  width: ${width}px;
  height: ${width / ratio}px;
`;

const UIPreview = styled.iframe<{ ratio: number }>`
  ${({ ratio }) => getPreviewDimensions(600, ratio)};

  @media (max-width: 1280px) {
    ${({ ratio }) => getPreviewDimensions(400, ratio)};
  }

  @media (max-width: 800px) {
    ${({ ratio }) => getPreviewDimensions(300, ratio)};
  }
`;
