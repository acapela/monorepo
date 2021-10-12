import React, { HTMLAttributes } from "react";
import styled from "styled-components";

export const Logo = styled((props: HTMLAttributes<SVGSVGElement>) => (
  <LogoSvg width="1em" height="1em" viewBox="0 0 498 498" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Acapela logo</title>

    <mask
      id="prefix__a"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={9}
      y={9}
      width={480}
      height={480}
    >
      <path
        d="M18.019 117.462c7.083-51.704 47.739-92.36 99.443-99.443a969.196 969.196 0 01263.076 0c51.704 7.083 92.36 47.739 99.443 99.443a969.177 969.177 0 010 263.076c-7.083 51.704-47.739 92.36-99.443 99.443a969.177 969.177 0 01-263.076 0c-51.704-7.083-92.36-47.739-99.443-99.443a969.196 969.196 0 010-263.076z"
        fill="#fff"
      />
    </mask>
    <g mask="url(#prefix__a)">
      <path
        d="M18.019 117.462c7.083-51.704 47.739-92.36 99.443-99.443a969.196 969.196 0 01263.076 0c51.704 7.083 92.36 47.739 99.443 99.443a969.177 969.177 0 010 263.076c-7.083 51.704-47.739 92.36-99.443 99.443a969.177 969.177 0 01-263.076 0c-51.704-7.083-92.36-47.739-99.443-99.443a969.196 969.196 0 010-263.076z"
        fill="url(#prefix__paint0_linear)"
      />
      <path
        d="M549 391.963c-72.265 1.74-123.895-57.616-164.834-112.661C348.365 232.961 309 180.569 249 181.398c-60-.829-99.365 51.563-135.083 97.904C72.977 334.347 21.099 393.703-51 391.963v-51.398c52.624 0 85.773-42.942 124.227-92.682C115.906 192.589 164.387 130 249 130s133.094 62.589 175.773 117.883c38.454 49.74 71.603 92.682 124.227 92.682v51.398z"
        fill="#fff"
      />
    </g>
    <defs>
      <linearGradient id="prefix__paint0_linear" x1={487} y1={483} x2={53} y2={0} gradientUnits="userSpaceOnUse">
        <stop stopColor="#EE551D" />
        <stop offset={0.339} stopColor="#E26E8C" />
        <stop offset={0.999} stopColor="#36E3E3" />
      </linearGradient>
    </defs>
  </LogoSvg>
))``;

export const SmallLogo = styled<HTMLAttributes<SVGSVGElement>>((props) => {
  return (
    <LogoSvg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.695.344C4.28.782.788 4.248.347 8.63a68.869 68.869 0 00-.334 8.248l5.838-4.753c5.668-4.615 13.832-4.615 19.5 0l5.937 4.834a68.874 68.874 0 00-.332-8.329C30.514 4.248 27.023.782 22.608.344a70.439 70.439 0 00-13.913 0zm22.182 22.858l-8.775-7.146a10.309 10.309 0 00-13.001 0L.417 23.127c.443 4.005 3.616 7.182 7.656 7.65a65.884 65.884 0 0015.156 0c4.015-.465 7.174-3.605 7.648-7.575z"
        fill="url(#prefix__paint0_linear)"
      />
      <defs>
        <linearGradient
          id="prefix__paint0_linear"
          x1={-0.349}
          y1={-0.346}
          x2={31.651}
          y2={30.854}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4CD5D9" />
          <stop offset={0.641} stopColor="#CE7D97" />
          <stop offset={1} stopColor="#E96151" />
        </linearGradient>
      </defs>
    </LogoSvg>
  );
})``;

const LogoSvg = styled.svg<{}>`
  height: 1em;
`;
