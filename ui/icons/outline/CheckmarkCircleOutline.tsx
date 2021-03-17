import * as React from "react";

function SvgCheckmarkCircleOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="checkmark-circle">
          <path d="M9.71 11.29a1 1 0 00-1.42 1.42l3 3A1 1 0 0012 16a1 1 0 00.72-.34l7-8a1 1 0 00-1.5-1.32L12 13.54z" />
          <path d="M21 11a1 1 0 00-1 1 8 8 0 01-8 8A8 8 0 016.33 6.36 7.93 7.93 0 0112 4a8.79 8.79 0 011.9.22 1 1 0 10.47-1.94A10.54 10.54 0 0012 2a10 10 0 00-7 17.09A9.93 9.93 0 0012 22a10 10 0 0010-10 1 1 0 00-1-1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgCheckmarkCircleOutline;
