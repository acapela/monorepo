import * as React from "react";

function SvgVolumeOff(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="volume-off">
          <path d="M16.91 14.08l1.44 1.44a6 6 0 00-.07-7.15 1 1 0 10-1.56 1.26 4 4 0 01.19 4.45z" />
          <path d="M21 12a6.51 6.51 0 01-1.78 4.39l1.42 1.42A8.53 8.53 0 0023 12a8.75 8.75 0 00-3.36-6.77 1 1 0 10-1.28 1.54A6.8 6.8 0 0121 12zM15 12.17V4a1 1 0 00-1.57-.83L9 6.2zM4.74 7.57H2a1 1 0 00-1 1v6.86a1 1 0 001 1h5l6.41 4.4A1.06 1.06 0 0014 21a1 1 0 001-1v-2.17zM4.71 3.29a1 1 0 00-1.42 1.42l16 16a1 1 0 001.42 0 1 1 0 000-1.42z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgVolumeOff;
