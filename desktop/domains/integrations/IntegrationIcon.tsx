import React from "react";
import styled from "styled-components";
interface Props {
  // TODO: we have 'png' imports type conflict with next.js
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageUrl: any;
}

export function IntegrationIcon({ imageUrl }: Props) {
  return <UIIcon style={{ backgroundImage: `url(${imageUrl})` }}></UIIcon>;
}

const UIIcon = styled.div`
  height: 1em;
  width: 1em;
  border-radius: 0.25em;
  background-size: cover;
  border: 1px solid rgba(0, 0, 0, 0.12);
`;
