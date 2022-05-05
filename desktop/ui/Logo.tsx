import React, { HTMLAttributes } from "react";
import styled from "styled-components";

import { appLogo } from "../assets";

export const Logo = styled((props: HTMLAttributes<HTMLImageElement>) => {
  return <LogoImage {...props} src={appLogo} />;
})``;

const LogoImage = styled.img`
  height: 1em;
  width: 1em;
`;
