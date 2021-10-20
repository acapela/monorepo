import React from "react";
import styled from "styled-components";

interface Props {
  url: string;
  ratio: number;
}

export const MessageLinkPreviewIFrame = ({ url, ratio }: Props) => {
  return <UIPreview ratio={ratio} src={url} allow="fullscreen" />;
};

const UIPreview = styled.iframe<{ ratio: number }>`
  width: 100%;
  aspect-ratio: ${(props) => props.ratio} / 1;

  @supports not (aspect-ratio: auto) {
    min-height: 320px;
  }
`;
