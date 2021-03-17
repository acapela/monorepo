import * as React from "react";

function SvgArrowheadDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="arrowhead-down">
          <path d="M17.37 12.39L12 16.71l-5.36-4.48a1 1 0 10-1.28 1.54l6 5a1 1 0 001.27 0l6-4.83a1 1 0 00.15-1.41 1 1 0 00-1.41-.14z" />
          <path d="M11.36 11.77a1 1 0 001.27 0l6-4.83a1 1 0 00.15-1.41 1 1 0 00-1.41-.15L12 9.71 6.64 5.23a1 1 0 00-1.28 1.54z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgArrowheadDown;
